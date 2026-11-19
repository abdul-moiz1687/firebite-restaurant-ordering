"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  PackageCheck,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";

const deliverySteps = [
  {
    id: "pending",
    label: "Order received",
    description: "Your order has reached Firebite.",
    icon: Clock,
  },
  {
    id: "confirmed",
    label: "Order confirmed",
    description: "The restaurant has confirmed your order.",
    icon: Check,
  },
  {
    id: "preparing",
    label: "Preparing your food",
    description: "Your food is being prepared.",
    icon: PackageCheck,
  },
  {
    id: "ready",
    label: "Order ready",
    description: "Your order is ready.",
    icon: Check,
  },
  {
    id: "out_for_delivery",
    label: "Out for delivery",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Your order is complete.",
    icon: Check,
  },
];

const pickupSteps = deliverySteps.filter(
  (step) => step.id !== "out_for_delivery"
);

export default function TrackOrderPage() {
  const params = useParams();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchOrder = useCallback(async (silent = false) => {
  try {
    const response = await fetch(
      `/api/orders/${encodeURIComponent(orderId)}`,
      { cache: "no-store" }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to find order.");
    }

    setOrder(result.order);
    setError("");
  } catch (err) {
    // Background polling ki temporary failure par
    // existing order screen ko hide nahi karna.
    if (!silent) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
      setOrder(null);
    }
  } finally {
    if (!silent) {
      setLoading(false);
    }
  }
}, [orderId]);

 useEffect(() => {
  if (!orderId) return;

  const initialFetch = setTimeout(() => {
    fetchOrder();
  }, 0);

  const pollingInterval = setInterval(() => {
    fetchOrder(true);
  }, 10000);

  return () => {
    clearTimeout(initialFetch);
    clearInterval(pollingInterval);
  };
}, [fetchOrder, orderId]);

  const handleRefresh = () => {
  setLoading(true);
  setError("");
  fetchOrder();
};

  const steps =
    order?.orderType === "pickup"
      ? pickupSteps
      : deliverySteps;

  const currentIndex = order
    ? steps.findIndex((step) => step.id === order.status)
    : -1;

  const isCancelled = order?.status === "cancelled";

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#756a61] transition hover:text-[#df4428]"
        >
          <ArrowLeft size={17} />
          Back to menu
        </Link>

        <div className="mt-9 text-center">
          <p className="text-xs font-extrabold tracking-[0.2em] text-[#df4428]">
            FIREBITE ORDER STATUS
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#241b17] sm:text-5xl">
            Track your order.
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#756a61]">
            Follow your order from confirmation to completion.
          </p>
        </div>

        <section className="mt-9 rounded-[28px] border border-[#e9e0d7] bg-white p-6 shadow-[0_12px_40px_rgba(49,31,21,0.05)] sm:p-9">
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw
                size={30}
                className="mx-auto animate-spin text-[#df4428]"
              />
              <p className="mt-4 text-sm text-[#756a61]">
                Retrieving your order...
              </p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <XCircle
                size={38}
                className="mx-auto text-red-500"
              />

              <h2 className="mt-4 text-xl font-extrabold text-[#241b17]">
                Order not found
              </h2>

              <p className="mt-2 text-sm text-[#756a61]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-6 rounded-full bg-[#df4428] px-6 py-3 text-sm font-bold text-white hover:bg-[#bd321b]"
              >
                Try again
              </button>
            </div>
          ) : order ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e0d7] pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#756a61]">
                    Order reference
                  </p>

                  <p className="mt-2 break-all text-sm font-extrabold text-[#241b17]">
                    {order.orderId}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchOrder}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e9e0d7] px-4 py-2.5 text-xs font-bold text-[#756a61] transition hover:border-[#df4428] hover:text-[#df4428]"
                >
                  <RefreshCw size={14} />
                  Refresh status
                </button>
              </div>

              {isCancelled ? (
                <div className="mt-8 rounded-2xl bg-red-50 p-6 text-center">
                  <XCircle
                    size={38}
                    className="mx-auto text-red-600"
                  />

                  <h2 className="mt-3 text-xl font-extrabold text-red-800">
                    Order cancelled
                  </h2>

                  <p className="mt-2 text-sm text-red-700">
                    Please contact the restaurant for further details.
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  <h2 className="text-xl font-extrabold text-[#241b17]">
                    Order progress
                  </h2>

                  <div className="mt-7 space-y-7">
                    {steps.map((step, index) => {
                      const completed = index <= currentIndex;
                      const active = index === currentIndex;
                      const Icon = step.icon;

                      return (
                        <div
                          key={step.id}
                          className="relative flex gap-4"
                        >
                          {index !== steps.length - 1 && (
                            <div
                              className={`absolute left-[19px] top-11 h-10 w-0.5 ${
                                index < currentIndex
                                  ? "bg-[#df4428]"
                                  : "bg-[#e9e0d7]"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-[#df4428] text-white"
                                : "border border-[#e9e0d7] bg-[#fffdf9] text-[#a3978d]"
                            }`}
                          >
                            {completed && !active ? (
                              <Check size={18} />
                            ) : (
                              <Icon size={18} />
                            )}
                          </div>

                          <div className="pt-1">
                            <p
                              className={`text-sm font-extrabold ${
                                completed
                                  ? "text-[#241b17]"
                                  : "text-[#9a8b80]"
                              }`}
                            >
                              {step.label}
                              {active && (
                                <span className="ml-2 rounded-full bg-[#fff1eb] px-2 py-1 text-[10px] font-bold uppercase text-[#df4428]">
                                  Current
                                </span>
                              )}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#756a61]">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {order.createdAt && (
                <p className="mt-8 border-t border-[#e9e0d7] pt-5 text-xs text-[#756a61]">
                  Order placed:{" "}
                  {new Date(order.createdAt).toLocaleString("en-PK")}
                </p>
              )}
            </>
          ) : null}
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-[#756a61]">
         Your order status is checked automatically for the latest updates.
        </p>
      </div>
    </main>
  );
}
