
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { menuItems, categories } from "@/data/menu";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const instant = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = menuItems.find((item) => item.id === id);

  return {
    title: product
      ? `${product.name} | Firebite`
      : "Product Not Found | Firebite",
    description: product?.description ?? "Explore the Firebite menu.",
  };
}

export default async function FoodDetailsPage({ params }) {
  const { id } = await params;

  const product = menuItems.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const category = categories.find(
    (item) => item.id === product.categoryId
  );

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#756a61] transition hover:text-[#df4428]"
        >
          <ArrowLeft size={17} />
          Back to Menu
        </Link>

        <div className="mt-9 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f6f0e9]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {product.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-[#df4428] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">

            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#df4428]">
              {category?.name ?? "Firebite Menu"}
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#241b17] sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#756a61]">
              {product.description}
            </p>

            <div className="mt-8 border-y border-[#e9e0d7] py-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#756a61]">
                Price
              </p>

              <p className="mt-2 text-3xl font-black text-[#241b17]">
                Rs. {product.price.toLocaleString("en-PK")}
              </p>
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-8 border-t border-[#e9e0d7] pt-6">
              <p className="text-sm font-semibold text-[#241b17]">
                Fresh food. Bold flavour. Firebite.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#756a61]">
                Explore more favourites from our menu.
              </p>

              <Link
                href="/menu"
                className="mt-3 inline-block text-sm font-bold text-[#df4428] hover:underline"
              >
                Explore Full Menu →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
