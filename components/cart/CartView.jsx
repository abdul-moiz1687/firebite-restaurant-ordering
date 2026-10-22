"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartView() {
  const {
    items,
    isReady,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!isReady) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-5 py-16">
        <p className="text-[#756a61]">Loading your cart...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#fffdf9] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#756a61] hover:text-[#df4428]"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        <div className="mt-7">
          <p className="text-xs font-bold tracking-[0.2em] text-[#df4428]">
            YOUR ORDER
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Your cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#e9e0d7] bg-white px-6 py-14 text-center">
            <ShoppingBag
              size={38}
              className="mx-auto text-[#df4428]"
            />

            <h2 className="mt-4 text-xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-[#756a61]">
              Find something delicious on our menu.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex rounded-full bg-[#df4428] px-6 py-3 font-bold text-white hover:bg-[#bd321b]"
            >
              Explore menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            <section
              aria-label="Cart items"
              className="space-y-4"
            >
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-[#e9e0d7] bg-white p-3 sm:gap-5 sm:p-5"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f6f0e9] sm:h-28 sm:w-28">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold sm:text-lg">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-[#df4428]">
                      Rs. {item.price.toLocaleString("en-PK")}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-[#e9e0d7] p-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#fff0e9]"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-4 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#fff0e9]"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#756a61] hover:text-red-600"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="hidden shrink-0 font-bold sm:block">
                    Rs.{" "}
                    {(item.price * item.quantity).toLocaleString("en-PK")}
                  </p>
                </article>
              ))}
            </section>

            <aside className="rounded-2xl border border-[#e9e0d7] bg-white p-5 sm:p-6">
              <h2 className="text-xl font-bold">Order summary</h2>

              <div className="mt-6 flex justify-between gap-4 text-sm">
                <span className="text-[#756a61]">
                  Subtotal (
                  {items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items)
                </span>

                <span className="font-bold">
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4 border-t border-[#e9e0d7] pt-4 text-sm">
                <span className="text-[#756a61]">Delivery fee</span>
                <span className="text-right text-[#756a61]">
                  Calculated at checkout
                </span>
              </div>

              <div className="mt-5 flex justify-between gap-4 border-t border-[#e9e0d7] pt-5">
                <span className="font-bold">Subtotal</span>
                <span className="text-lg font-black">
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#756a61]">
                Delivery charges and final order details will be
                confirmed at checkout.
              </p>

            <Link
  href="/checkout"
  className="mt-5 flex w-full items-center justify-center rounded-full bg-[#df4428] px-5 py-4 font-bold text-white transition hover:bg-[#bd321b]"
>
  Continue to checkout
</Link>

<Link
  href="/menu"
  className="mt-3 flex w-full items-center justify-center rounded-full border border-[#e9e0d7] px-5 py-3 text-sm font-bold transition hover:border-[#df4428] hover:text-[#df4428]"
>
  Continue shopping
</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}