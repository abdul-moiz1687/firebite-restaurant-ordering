"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { items, isReady } = useCart();

  const count = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart, ${count} items`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e9e0d7] transition hover:border-[#df4428] hover:text-[#df4428]"
    >
      <ShoppingBag size={21} />

      {isReady && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#df4428] px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}