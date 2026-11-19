
import { NextResponse, connection } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-auth";

function serializeDate(value) {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

export async function GET() {
  await connection();

  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const snapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        customer: data.customer || {},
        orderType: data.orderType || "delivery",
        delivery: data.delivery || null,
        notes: data.notes || "",
        items: Array.isArray(data.items) ? data.items : [],
        subtotal: Number(data.subtotal) || 0,
        currency: data.currency || "PKR",
        status: data.status || "pending",
        createdAt: serializeDate(data.createdAt),
      };
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      { error: "Unable to load orders." },
      { status: 500 }
    );
  }
}
