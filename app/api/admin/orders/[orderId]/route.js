
import { NextResponse, connection } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-auth";

const validStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export async function PATCH(request, { params }) {
  await connection();

  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { orderId } = await params;

    if (!orderId || !/^[A-Za-z0-9]{20}$/.test(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnapshot = await orderRef.get();

    if (!orderSnapshot.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    await orderRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      status,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    console.error("Admin order PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to update order status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connection();

  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { orderId } = await params;

    if (!orderId || !/^[A-Za-z0-9]{20}$/.test(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnapshot = await orderRef.get();

    if (!orderSnapshot.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    await orderRef.delete();

    return NextResponse.json({
      success: true,
      message: "Order permanently deleted.",
    });
  } catch (error) {
    console.error("Admin order DELETE error:", error);

    return NextResponse.json(
      { error: "Unable to permanently delete order." },
      { status: 500 }
    );
  }
}
