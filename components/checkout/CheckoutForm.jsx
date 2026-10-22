"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShoppingBag,
  LoaderCircle
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";

export default function CheckoutForm() {
  const {
  items,
  isReady: isCartReady,
  clearCart,
} = useCart();

  const {
    selectedArea,
    isReady: isLocationReady,
    openModal,
  } = useLocation();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    orderType: "delivery",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");
const [orderResult, setOrderResult] = useState(null);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
setSubmitError("");
  }

  async function handleSubmit(event) {
  event.preventDefault();
  setSubmitError("");
  setErrors({});

  const nextErrors = {};
  const cleanName = form.fullName.trim();
  const cleanAddress = form.address.trim();
  const phone = form.phone.replace(/[\s()-]/g, "");

  if (cleanName.length < 2) {
    nextErrors.fullName = "Enter your full name.";
  }

  if (!/^(03\d{9}|\+923\d{9}|923\d{9})$/.test(phone)) {
    nextErrors.phone = "Enter a valid Pakistani mobile number.";
  }

  if (form.orderType === "delivery" && !selectedArea) {
    nextErrors.area = "Select your delivery area.";
  }

  if (
    form.orderType === "delivery" &&
    (cleanAddress.length < 8 || cleanAddress.length > 300)
  ) {
    nextErrors.address = "Enter a complete delivery address.";
  }

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }

  setIsSubmitting(true);

  try {
    const requestStartedAt = performance.now();
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: cleanName,
        phone: form.phone.trim(),
        orderType: form.orderType,
        address: form.orderType === "delivery" ? cleanAddress : "",
        notes: form.notes.trim(),
        areaId:
          form.orderType === "delivery" ? selectedArea.id : null,
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    const result = await response.json();

    console.info(
  `[Checkout] Order API response: ${Math.round(
    performance.now() - requestStartedAt
  )} ms`
);

    if (!response.ok) {
      throw new Error(result.error || "Unable to place your order.");
    }

    const itemLines = result.items.map(
      (item) =>
        `${item.name} x ${item.quantity} = Rs. ${item.lineTotal.toLocaleString("en-PK")}`
    );

    const message = [
      "*FIREBITE ORDER*",
      `Order ID: ${result.orderId}`,
      `Customer: ${cleanName}`,
      `Phone: ${form.phone.trim()}`,
      `Type: ${form.orderType === "delivery" ? "Delivery" : "Pickup"}`,
      ...(form.orderType === "delivery"
        ? [
            `Area: ${selectedArea.name}`,
            `Address: ${cleanAddress}`,
          ]
        : []),
      "",
      "*Items:*",
      ...itemLines,
      "",
      `Subtotal: Rs. ${result.subtotal.toLocaleString("en-PK")}`,
      ...(form.notes.trim() ? [`Notes: ${form.notes.trim()}`] : []),
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${siteConfig.whatsappNumber}` +
      `?text=${encodeURIComponent(message)}`;

    setOrderResult({
      orderId: result.orderId,
      subtotal: result.subtotal,
      whatsappUrl,
    });

    clearCart();
  } catch (error) {
    setSubmitError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
}

  if (!isCartReady || !isLocationReady) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16">
        Loading checkout...
      </main>
    );
  }

  if (orderResult) {
  return (
    <main className="min-h-[70vh] bg-[#fffdf9] px-5 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#e9e0d7] bg-white p-7 text-center sm:p-10">
        <h1 className="text-3xl font-black">
          Order saved successfully!
        </h1>

        <p className="mt-4 text-sm text-[#756a61]">
          Your order ID is:
        </p>

        <p className="mt-1 break-all font-bold">
          {orderResult.orderId}
        </p>

        <p className="mt-4 text-sm text-[#756a61]">
          Subtotal: Rs. {orderResult.subtotal.toLocaleString("en-PK")}
        </p>

        <p className="mt-4 text-sm leading-6 text-[#756a61]">
          Your order has been saved. Continue to WhatsApp to share
          the order details with the restaurant. The message still
          needs to be sent manually.
        </p>

        <a
          href={orderResult.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#df4428] px-5 py-4 font-bold text-white transition hover:bg-[#bd321b]"
        >
          Continue to WhatsApp
        </a>

        <Link
          href="/menu"
          className="mt-4 inline-flex text-sm font-semibold text-[#756a61] hover:text-[#df4428]"
        >
          Back to menu
        </Link>
      </div>
    </main>
  );
}

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 text-center">
        <ShoppingBag
          size={40}
          className="mx-auto text-[#df4428]"
        />

        <h1 className="mt-4 text-2xl font-black">
          Your cart is empty
        </h1>

        <p className="mt-2 text-[#756a61]">
          Add some items before checking out.
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-flex rounded-full bg-[#df4428] px-6 py-3 font-bold text-white"
        >
          Browse menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#756a61] hover:text-[#df4428]"
        >
          <ArrowLeft size={17} />
          Back to cart
        </Link>

        <div className="mt-7">
          <p className="text-xs font-bold tracking-[0.2em] text-[#df4428]">
            ALMOST THERE
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-[#756a61] sm:text-base">
            Enter your contact and order details.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 rounded-3xl border border-[#e9e0d7] bg-white p-5 sm:p-8"
          >
            <section>
              <h2 className="text-xl font-bold">
                Contact information
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-[#e9e0d7] px-4 py-3 outline-none focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/10"
                  />

                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Mobile number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    className="w-full rounded-xl border border-[#e9e0d7] px-4 py-3 outline-none focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/10"
                  />

                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="border-t border-[#e9e0d7] pt-6">
              <h2 className="text-xl font-bold">
                How would you like your order?
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e9e0d7] p-4 has-[:checked]:border-[#df4428] has-[:checked]:bg-[#fff8f4]">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={form.orderType === "delivery"}
                    onChange={handleChange}
                    className="accent-[#df4428]"
                  />

                  <Truck size={20} className="text-[#df4428]" />

                  <span className="text-sm font-semibold">
                    Home delivery
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e9e0d7] p-4 has-[:checked]:border-[#df4428] has-[:checked]:bg-[#fff8f4]">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={form.orderType === "pickup"}
                    onChange={handleChange}
                    className="accent-[#df4428]"
                  />

                  <Store size={20} className="text-[#df4428]" />

                  <span className="text-sm font-semibold">
                    Pickup
                  </span>
                </label>
              </div>
            </section>

            {form.orderType === "delivery" && (
              <section className="border-t border-[#e9e0d7] pt-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">
                    Delivery address
                  </h2>

                  <button
                    type="button"
                    onClick={openModal}
                    className="text-sm font-semibold text-[#df4428] hover:underline"
                  >
                    Change area
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-[#fff8f4] p-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#df4428]" />

                    <span className="text-sm font-semibold">
                      {selectedArea?.name ?? "Select your area"}
                    </span>
                  </div>

                  {errors.area && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.area}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Complete address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / flat, street, block and nearby landmark"
                    className="w-full resize-y rounded-xl border border-[#e9e0d7] px-4 py-3 outline-none focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/10"
                  />

                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </section>
            )}

            <section className="border-t border-[#e9e0d7] pt-6">
              <label
                htmlFor="notes"
                className="block text-sm font-semibold"
              >
                Order notes{" "}
                <span className="font-normal text-[#756a61]">
                  (optional)
                </span>
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={2}
                maxLength={300}
                value={form.notes}
                onChange={handleChange}
                placeholder="Any instructions for your order?"
                className="mt-2 w-full resize-y rounded-xl border border-[#e9e0d7] px-4 py-3 outline-none focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/10"
              />
            </section>

           <button
  type="submit"
  disabled={isSubmitting}
  aria-busy={isSubmitting}
  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#df4428] px-5 py-4 font-bold text-white shadow-sm transition duration-200 hover:bg-[#bd321b] disabled:cursor-wait disabled:opacity-80"
>
  {isSubmitting ? (
    <>
      <LoaderCircle size={19} className="animate-spin" />
      Saving your order securely...
    </>
  ) : (
    "Place order"
  )}
</button>

{isSubmitting && (
  <p
    role="status"
    aria-live="polite"
    className="mt-3 text-center text-sm leading-6 text-[#756a61]"
  >
    Checking your order and saving it. Please keep this page open.
  </p>
)}

{submitError && (
  <p role="alert" className="mt-3 text-sm text-red-600">
    {submitError}
  </p>
)}

{submitError && (
  <p role="alert" className="mt-3 text-sm text-red-600">
    {submitError}
  </p>
)}
          </form>

          <aside className="rounded-3xl border border-[#e9e0d7] bg-white p-5 sm:p-6">
            <h2 className="text-xl font-bold">Order summary</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-[#756a61]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="shrink-0 font-semibold">
                    Rs.{" "}
                    {(item.price * item.quantity).toLocaleString("en-PK")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between gap-4 border-t border-[#e9e0d7] pt-5">
              <span className="font-semibold">Subtotal</span>

              <span className="text-lg font-black">
                Rs. {subtotal.toLocaleString("en-PK")}
              </span>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#756a61]">
              Delivery charges, availability and final pricing will
              be confirmed before the order is submitted.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}