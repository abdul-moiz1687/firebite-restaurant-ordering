
import { adminDb } from "@/lib/firebase-admin";

const validStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export async function GET(request, { params }) {
  const { orderId } = await params;

  if (
    typeof orderId !== "string" ||
    !/^[A-Za-z0-9]{20}$/.test(orderId)
  ) {
    return Response.json(
      { error: "Invalid order ID." },
      { status: 400 }
    );
  }

  try {
    const snapshot = await adminDb
      .collection("orders")
      .doc(orderId)
      .get();

    if (!snapshot.exists) {
      return Response.json(
        { error: "Order not found. Check your order ID." },
        { status: 404 }
      );
    }

    const data = snapshot.data();

    return Response.json(
      {
        success: true,
        order: {
          orderId,
          status: validStatuses.includes(data.status)
            ? data.status
            : "pending",
          orderType: data.orderType === "pickup"
            ? "pickup"
            : "delivery",
          createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Order tracking failed:", error);

    return Response.json(
      { error: "Unable to retrieve order status." },
      { status: 500 }
    );
  }
}
