import { connection } from "next/server";
import { AggregateField, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-auth";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Karachi",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function dateKey(date) {
  return dateFormatter.format(date);
}

function karachiDayStart(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day, -5));
}

export async function GET() {
  await connection();

  try {
    const session = await getAdminSession();

    if (!session) {
      return Response.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const ordersRef = adminDb.collection("orders");

    const todayParts = dateKey(new Date()).split("-").map(Number);
    const [year, month, day] = todayParts;

    const todayStart = karachiDayStart(year, month, day);
    const sevenDaysStart = karachiDayStart(
      year,
      month,
      day - 6
    );

    const [
      totalSnapshot,
      todaySnapshot,
      pendingSnapshot,
      confirmedSnapshot,
      preparingSnapshot,
      readySnapshot,
      deliverySnapshot,
      deliveredSnapshot,
      cancelledSnapshot,
      deliveredValueSnapshot,
      weeklyOrdersSnapshot,
      recentSnapshot,
    ] = await Promise.all([
      ordersRef.count().get(),

      ordersRef
        .where("createdAt", ">=", Timestamp.fromDate(todayStart))
        .count()
        .get(),

      ...statuses.map((status) =>
        ordersRef.where("status", "==", status).count().get()
      ),

      ordersRef
        .where("status", "==", "delivered")
        .aggregate({
          value: AggregateField.sum("subtotal"),
        })
        .get(),

      ordersRef
        .where("createdAt", ">=", Timestamp.fromDate(sevenDaysStart))
        .orderBy("createdAt", "asc")
        .get(),

      ordersRef.orderBy("createdAt", "desc").limit(5).get(),
    ]);

    const statusSnapshots = {
      pending: pendingSnapshot,
      confirmed: confirmedSnapshot,
      preparing: preparingSnapshot,
      ready: readySnapshot,
      out_for_delivery: deliverySnapshot,
      delivered: deliveredSnapshot,
      cancelled: cancelledSnapshot,
    };

    const statusCounts = Object.fromEntries(
      statuses.map((status) => [
        status,
        statusSnapshots[status].data().count,
      ])
    );

    const revenueMap = new Map();

    for (let index = 0; index < 7; index++) {
      const currentDate = new Date(
        Date.UTC(year, month - 1, day - 6 + index)
      );

      const key = dateKey(currentDate);

      revenueMap.set(key, {
        date: key,
        label: new Intl.DateTimeFormat("en-PK", {
          timeZone: "Asia/Karachi",
          day: "numeric",
          month: "short",
        }).format(karachiDayStart(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth() + 1,
          currentDate.getUTCDate()
        )),
        value: 0,
      });
    }

    weeklyOrdersSnapshot.docs.forEach((doc) => {
      const order = doc.data();

      if (
        order.status !== "delivered" ||
        !order.createdAt?.toDate
      ) {
        return;
      }

      const key = dateKey(order.createdAt.toDate());

      if (revenueMap.has(key)) {
        const entry = revenueMap.get(key);

        entry.value += Number(order.subtotal) || 0;
      }
    });

    const recentOrders = recentSnapshot.docs.map((doc) => {
      const order = doc.data();

      return {
        id: doc.id,
        customerName: order.customer?.fullName ?? "Customer",
        subtotal: Number(order.subtotal) || 0,
        status: order.status ?? "pending",
        orderType: order.orderType ?? "delivery",
        createdAt: order.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return Response.json(
      {
        statistics: {
          totalOrders: totalSnapshot.data().count,
          todayOrders: todaySnapshot.data().count,
          pendingOrders: pendingSnapshot.data().count,
          deliveredOrders: deliveredSnapshot.data().count,
          deliveredOrderValue:
            deliveredValueSnapshot.data().value ?? 0,
        },
        statusCounts,
        revenue: Array.from(revenueMap.values()),
        recentOrders,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin dashboard API error:", error);

    return Response.json(
      { error: "Unable to load dashboard data." },
      { status: 500 }
    );
  }
}