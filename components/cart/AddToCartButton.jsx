"use client";

import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart, isReady } = useCart();

  function handleAddToCart() {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!isReady}
      className="inline-flex items-center gap-2 rounded-full bg-[#df4428] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bd321b] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus size={16} />
      Add
      <ShoppingBag size={16} />
    </button>
  );
}