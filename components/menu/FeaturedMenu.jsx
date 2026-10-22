import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { menuItems } from "@/data/menu";
import MenuGrid from "@/components/menu/MenuGrid";

export default function FeaturedMenu() {
  const featuredItems = menuItems.filter(
    (item) => item.featured
  );

  return (
    <section
      id="popular"
      aria-labelledby="featured-heading"
      className="bg-[#fffdf9] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#df4428]">
              CUSTOMER FAVOURITES
            </p>

            <h2
              id="featured-heading"
              className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
            >
              The favourites.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#756a61] sm:text-base">
              A few crowd-pleasers to get your order started.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e9e0d7] px-5 py-3 text-sm font-bold transition hover:border-[#df4428] hover:text-[#df4428]"
          >
            View Full Menu
            <ArrowRight size={17} />
          </Link>
        </div>

        <MenuGrid items={featuredItems} />
      </div>
    </section>
  );
}