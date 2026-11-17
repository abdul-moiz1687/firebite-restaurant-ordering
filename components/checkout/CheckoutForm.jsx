"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Store,
  ShoppingBag,
  LoaderCircle,
  CheckCircle2,
  ShieldCheck,
  UserRound,
  Phone,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";

const formatPrice = (amount) =>
  amount.toLocaleString("en-PK");

const inputClass =
  "w-full rounded-xl border border-[#e9e0d7] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#241b17] outline-none transition placeholder:text-[#a3978d] hover:border-[#d8c9bc] focus:border-[#df4428] focus:ring-4 focus:ring-[#df4428]/10";

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p className="mt-2 text-xs font-medium text-red-600" role="alert">
      {children}
    </p>
  );
}

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

  const submissionLock = useRef(false);

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

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
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
      ...(name === "orderType"
        ? { area: "", address: "" }
        : {}),
    }));

    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionLock.current) return;

    setSubmitError("");
    setErrors({});

    const nextErrors = {};
    const cleanName = form.fullName.trim();
    const cleanAddress = form.address.trim();
    const phone = form.phone.replace(/[\s()-]/g, "");

    if (cleanName.length < 2 || cleanName.length > 80) {
      nextErrors.fullName = "Enter a valid name (2–80 characters).";
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

    if (form.notes.trim().length > 300) {
      nextErrors.notes = "Notes must be 300 characters or fewer.";
    }

    if (items.length === 0) {
      setSubmitError("Your cart is empty. Add items before checkout.");
      return;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: cleanName,
          phone: form.phone.trim(),
          orderType: form.orderType,
          address:
            form.orderType === "delivery" ? cleanAddress : "",
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

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to place your order."
        );
      }

      const itemLines = result.items.map(
        (item) =>
          `${item.name} x ${item.quantity} = Rs. ${formatPrice(item.lineTotal)}`
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
        `Subtotal: Rs. ${formatPrice(result.subtotal)}`,
        ...(form.notes.trim()
          ? [`Notes: ${form.notes.trim()}`]
          : []),
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
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  if (!isCartReady || !isLocationReady) {
    return (
      <main className="min-h-[70vh] bg-[#fffdf9] px-5 py-16">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-8 w-48 rounded-lg bg-[#eee5dc]" />
          <div className="h-5 w-72 rounded-lg bg-[#eee5dc]" />
          <div className="h-64 rounded-3xl bg-[#eee5dc]" />
        </div>
      </main>
    );
  }

  // Successful order screen
  if (orderResult) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#fffdf9] px-5 py-14 sm:px-8">
        <div className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-[#e9e0d7] bg-white shadow-[0_24px_70px_rgba(49,31,21,0.08)]">
          <div className="bg-[#fff5ef] px-6 py-12 text-center sm:px-12">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#df4428] text-white shadow-lg shadow-[#df4428]/20">
              <CheckCircle2 size={42} strokeWidth={1.8} />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-[#df4428]">
              ORDER RECEIVED
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#241b17] sm:text-4xl">
              Your order is saved!
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#756a61]">
              Your order has been securely saved. Share the
              details with our restaurant on WhatsApp to continue
              the ordering process.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#756a61]">
                Your order reference
              </p>

              <p className="mt-2 break-all text-lg font-black text-[#241b17]">
                {orderResult.orderId}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#e9e0d7] pt-4">
                <span className="text-sm font-semibold text-[#756a61]">
                  Order subtotal
                </span>

                <span className="text-xl font-black text-[#241b17]">
                  Rs. {formatPrice(orderResult.subtotal)}
                </span>
              </div>
            </div>

            <a
              href={orderResult.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#df4428] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#df4428]/15 transition hover:-translate-y-0.5 hover:bg-[#bd321b]"
            >
              <MessageCircle size={19} />
              Continue to WhatsApp
            </a>

            <p className="mt-3 text-center text-xs leading-5 text-[#756a61]">
              Your WhatsApp message still needs to be sent manually.
            </p>

<Link
  href={`/track-order/${orderResult.orderId}`}
  className="mt-4 flex justify-center text-sm font-bold text-[#df4428] hover:underline"
>
  Track your order
</Link>

            <Link
              href="/menu"
              className="mt-6 flex justify-center text-sm font-bold text-[#756a61] transition hover:text-[#df4428]"
            >
              Continue exploring the menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Empty cart screen
  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fffdf9] px-5 py-16">
        <div className="w-full max-w-lg rounded-[28px] border border-[#e9e0d7] bg-white px-6 py-14 text-center shadow-[0_16px_50px_rgba(49,31,21,0.05)]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#fff1eb] text-[#df4428]">
            <ShoppingBag size={30} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[#241b17]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#756a61]">
            Add your favourite dishes before continuing to checkout.
          </p>

          <Link
            href="/menu"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#df4428] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#bd321b]"
          >
            Explore the menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#756a61] transition hover:text-[#df4428]"
        >
          <ArrowLeft size={17} />
          Back to cart
        </Link>

        {/* Page heading */}
        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold tracking-[0.2em] text-[#df4428]">
              ALMOST THERE
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#241b17] sm:text-5xl">
              Checkout
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#756a61] sm:text-base">
              A few details and your Firebite favourites will be
              on their way.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-[#e9e0d7] bg-white px-4 py-2.5 sm:self-auto">
            <ShieldCheck size={17} className="text-[#df4428]" />
            <span className="text-xs font-bold text-[#756a61]">
              Secure order submission
            </span>
          </div>
        </div>

        <div className="mt-9 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-9">

          {/* Checkout form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >

            {/* Contact information */}
            <section className="rounded-[26px] border border-[#e9e0d7] bg-white p-5 shadow-[0_8px_30px_rgba(49,31,21,0.035)] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#df4428]">
                  <UserRound size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#df4428]">
                    STEP 01
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-[#241b17]">
                    Contact information
                  </h2>

                  <p className="mt-1 text-sm text-[#756a61]">
                    How can the restaurant reach you?
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-bold text-[#33251e]"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    maxLength={80}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                    className={`${inputClass} ${
                      errors.fullName ? "border-red-400" : ""
                    }`}
                  />

                  <div id="fullName-error">
                    <FieldError>{errors.fullName}</FieldError>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-[#33251e]"
                  >
                    Mobile number
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a8b80]"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      className={`${inputClass} pl-11 ${
                        errors.phone ? "border-red-400" : ""
                      }`}
                    />
                  </div>

                  <div id="phone-error">
                    <FieldError>{errors.phone}</FieldError>
                  </div>
                </div>
              </div>
            </section>

            {/* Order type */}
            <section className="rounded-[26px] border border-[#e9e0d7] bg-white p-5 shadow-[0_8px_30px_rgba(49,31,21,0.035)] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#df4428]">
                  <Truck size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#df4428]">
                    STEP 02
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-[#241b17]">
                    How would you like your order?
                  </h2>

                  <p className="mt-1 text-sm text-[#756a61]">
                    Choose delivery or pickup.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                    form.orderType === "delivery"
                      ? "border-[#df4428] bg-[#fff7f2] shadow-[0_0_0_2px_rgba(223,68,40,0.06)]"
                      : "border-[#e9e0d7] bg-white hover:border-[#d8c9bc]"
                  }`}
                >
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={form.orderType === "delivery"}
                    onChange={handleChange}
                    className="size-4 accent-[#df4428]"
                  />

                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff1eb] text-[#df4428]">
                    <Truck size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#241b17]">
                      Home delivery
                    </p>

                    <p className="mt-1 text-xs text-[#756a61]">
                      Delivered to your door
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                    form.orderType === "pickup"
                      ? "border-[#df4428] bg-[#fff7f2] shadow-[0_0_0_2px_rgba(223,68,40,0.06)]"
                      : "border-[#e9e0d7] bg-white hover:border-[#d8c9bc]"
                  }`}
                >
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={form.orderType === "pickup"}
                    onChange={handleChange}
                    className="size-4 accent-[#df4428]"
                  />

                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff1eb] text-[#df4428]">
                    <Store size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#241b17]">
                      Pickup
                    </p>

                    <p className="mt-1 text-xs text-[#756a61]">
                      Collect your order
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Delivery address */}
            {form.orderType === "delivery" && (
              <section className="rounded-[26px] border border-[#e9e0d7] bg-white p-5 shadow-[0_8px_30px_rgba(49,31,21,0.035)] sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#df4428]">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#df4428]">
                      STEP 03
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-[#241b17]">
                      Delivery address
                    </h2>

                    <p className="mt-1 text-sm text-[#756a61]">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#f0ded3] bg-[#fff8f4] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#df4428]">
                        <MapPin size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#756a61]">
                          Selected delivery area
                        </p>

                        <p className="mt-1 truncate text-sm font-extrabold text-[#241b17]">
                          {selectedArea?.name ?? "No area selected"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={openModal}
                      className="rounded-full border border-[#df4428]/30 bg-white px-4 py-2 text-xs font-bold text-[#df4428] transition hover:bg-[#df4428] hover:text-white"
                    >
                      {selectedArea ? "Change area" : "Select area"}
                    </button>
                  </div>

                  <FieldError>{errors.area}</FieldError>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold text-[#33251e]"
                  >
                    Complete address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    rows={4}
                    maxLength={300}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / flat number, street, block and nearby landmark"
                    aria-invalid={Boolean(errors.address)}
                    className={`${inputClass} resize-y ${
                      errors.address ? "border-red-400" : ""
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <FieldError>{errors.address}</FieldError>

                    <span className="mt-2 shrink-0 text-xs text-[#9a8b80]">
                      {form.address.length}/300
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Order notes */}
            <section className="rounded-[26px] border border-[#e9e0d7] bg-white p-5 shadow-[0_8px_30px_rgba(49,31,21,0.035)] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#df4428]">
                  <ClipboardList size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#241b17]">
                    Additional instructions
                  </h2>

                  <p className="mt-1 text-sm text-[#756a61]">
                    Anything we should know? (Optional)
                  </p>
                </div>
              </div>

              <textarea
                id="notes"
                name="notes"
                rows={3}
                maxLength={300}
                value={form.notes}
                onChange={handleChange}
                placeholder="Add any special instructions for your order..."
                className={`${inputClass} mt-6 resize-y`}
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-[#9a8b80]">
                  {form.notes.length}/300
                </span>
              </div>
            </section>

            {/* Submit area */}
            <div className="rounded-[26px] border border-[#e9e0d7] bg-white p-5 shadow-[0_8px_30px_rgba(49,31,21,0.035)] sm:p-7">
              {submitError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#df4428] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#df4428]/15 transition hover:-translate-y-0.5 hover:bg-[#bd321b] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Saving your order...
                  </>
                ) : (
                  <>
                    Place order
                    <ArrowLeft size={17} className="rotate-180" />
                  </>
                )}
              </button>

              <p
                role="status"
                aria-live="polite"
                className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[#756a61]"
              >
                <ShieldCheck size={15} className="shrink-0 text-[#df4428]" />
                {isSubmitting
                  ? "Verifying and securely saving your order. Please wait."
                  : "Your order details are validated before submission."}
              </p>
            </div>
          </form>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[26px] border border-[#e9e0d7] bg-white shadow-[0_12px_40px_rgba(49,31,21,0.06)]">
              <div className="border-b border-[#f0e7df] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff1eb] text-[#df4428]">
                    <ShoppingBag size={20} />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-[#241b17]">
                      Order summary
                    </h2>

                    <p className="mt-0.5 text-xs text-[#756a61]">
                      {totalItems} {totalItems === 1 ? "item" : "items"} in your order
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[380px] space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f6f0e9]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold text-[#241b17]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#756a61]">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-extrabold text-[#241b17]">
                      Rs. {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#f0e7df] bg-[#fffdf9] px-5 py-5 sm:px-6">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-[#756a61]">Subtotal</span>

                  <span className="font-bold text-[#241b17]">
                    Rs. {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="mt-4 flex justify-between gap-4 text-sm">
                  <span className="text-[#756a61]">Delivery fee</span>

                  <span className="text-right text-xs font-semibold text-[#756a61]">
                    Confirmed with restaurant
                  </span>
                </div>

                <div className="mt-5 flex justify-between gap-4 border-t border-[#e9e0d7] pt-5">
                  <span className="font-extrabold text-[#241b17]">
                    Subtotal
                  </span>

                  <span className="text-xl font-black text-[#241b17]">
                    Rs. {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#756a61]">
                  Final delivery charges and order details will be
                  confirmed with the restaurant on WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e9e0d7] bg-white p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#df4428]"
              />

              <p className="text-xs leading-5 text-[#756a61]">
                Your order is submitted through a validated server
                endpoint before being saved.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
