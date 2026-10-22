import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { menuItems } from "@/data/menu";
import { deliveryAreas } from "@/data/deliveryAreas";
import { getOrderRateLimiter } from "@/lib/rateLimit";

export async function POST(request) {

const forwardedFor = request.headers.get("x-forwarded-for");

const clientIp =
  request.headers.get("x-real-ip")?.trim() ||
  forwardedFor?.split(",")[0]?.trim() ||
  (process.env.NODE_ENV === "development"
    ? "local-development"
    : "");

if (!clientIp) {
  return Response.json(
    { error: "Unable to verify the request source." },
    { status: 503 }
  );
}

try {
  const limiter = getOrderRateLimiter();
  const { success, limit, remaining, reset } =
    await limiter.limit(clientIp);

  if (!success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((reset - Date.now()) / 1000)
    );

    return Response.json(
      { error: "Too many order attempts. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  }
} catch (error) {
  console.error("Order rate limiter failed:", error);

  return Response.json(
    { error: "Ordering is temporarily unavailable. Please try again." },
    { status: 503 }
  );
}

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return Response.json(
      { error: "Request must be JSON." },
      { status: 415 }
    );
  }

  const contentLength = Number(
    request.headers.get("content-length") ?? 0
  );

  if (contentLength > 20_000) {
    return Response.json(
      { error: "Request is too large." },
      { status: 413 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Invalid order data." },
      { status: 400 }
    );
  }

  const fullName =
    typeof body.fullName === "string" ? body.fullName.trim() : "";

  const phoneInput =
    typeof body.phone === "string" ? body.phone.trim() : "";

  const phone = phoneInput.replace(/[\s()-]/g, "");

  const orderType = body.orderType;
  const address =
    typeof body.address === "string" ? body.address.trim() : "";

  const notes =
    typeof body.notes === "string" ? body.notes.trim() : "";

  if (fullName.length < 2 || fullName.length > 80) {
    return Response.json(
      { error: "Enter a valid name." },
      { status: 400 }
    );
  }

  if (!/^(03\d{9}|\+923\d{9}|923\d{9})$/.test(phone)) {
    return Response.json(
      { error: "Enter a valid Pakistani mobile number." },
      { status: 400 }
    );
  }

  if (!["delivery", "pickup"].includes(orderType)) {
    return Response.json(
      { error: "Choose delivery or pickup." },
      { status: 400 }
    );
  }

  if (notes.length > 300) {
    return Response.json(
      { error: "Order notes must be 300 characters or fewer." },
      { status: 400 }
    );
  }

  let area = null;

  if (orderType === "delivery") {
    if (address.length < 8 || address.length > 300) {
      return Response.json(
        { error: "Enter a complete delivery address." },
        { status: 400 }
      );
    }

    area = deliveryAreas.find(
      (item) => item.id === body.areaId
    );

    if (!area) {
      return Response.json(
        { error: "Choose a valid delivery area." },
        { status: 400 }
      );
    }
  }

  if (
    !Array.isArray(body.items) ||
    body.items.length === 0 ||
    body.items.length > 12
  ) {
    return Response.json(
      { error: "Your order must contain valid menu items." },
      { status: 400 }
    );
  }

  const seenIds = new Set();
  const verifiedItems = [];
  let totalQuantity = 0;

  for (const requestedItem of body.items) {
    if (
      !requestedItem ||
      typeof requestedItem.id !== "string" ||
      !Number.isInteger(requestedItem.quantity) ||
      requestedItem.quantity < 1 ||
      requestedItem.quantity > 20
    ) {
      return Response.json(
        { error: "An item or quantity is invalid." },
        { status: 400 }
      );
    }

    if (seenIds.has(requestedItem.id)) {
      return Response.json(
        { error: "Duplicate items are not allowed." },
        { status: 400 }
      );
    }

    seenIds.add(requestedItem.id);
    totalQuantity += requestedItem.quantity;

    if (totalQuantity > 50) {
      return Response.json(
        { error: "The order quantity limit was exceeded." },
        { status: 400 }
      );
    }

    const product = menuItems.find(
      (item) => item.id === requestedItem.id
    );

    if (
      !product ||
      !Number.isSafeInteger(product.price) ||
      product.price < 0
    ) {
      return Response.json(
        { error: "A selected product is unavailable." },
        { status: 400 }
      );
    }

    verifiedItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: requestedItem.quantity,
      lineTotal: product.price * requestedItem.quantity,
    });
  }

  const subtotal = verifiedItems.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  if (!Number.isSafeInteger(subtotal)) {
    return Response.json(
      { error: "Order total is invalid." },
      { status: 400 }
    );
  }

  try {
    const orderRef = adminDb.collection("orders").doc();

    await orderRef.set({
      customer: {
        fullName,
        phone,
      },
      orderType,
      delivery:
        orderType === "delivery"
          ? {
              areaId: area.id,
              areaName: area.name,
              address,
            }
          : null,
      notes,
      items: verifiedItems,
      subtotal,
      currency: "PKR",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

   return Response.json(
  {
    success: true,
    orderId: orderRef.id,
    subtotal,
    currency: "PKR",
    items: verifiedItems,
  },
  { status: 201 }
);
  } catch (error) {
    console.error("Order creation failed:", error);

    return Response.json(
      { error: "Unable to place your order right now." },
      { status: 500 }
    );
  }
}