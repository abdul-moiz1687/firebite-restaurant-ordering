import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { menuItems, categories } from "@/data/menu";
import MenuGrid from "@/components/menu/MenuGrid";

export const metadata = {
  title: "Full Menu | Firebite",
  description:
    "Explore burgers, BBQ, crispy chicken and sides on the Firebite menu.",
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#756a61] transition hover:text-[#df4428]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#df4428]">
            THE FIREBITE MENU
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Find your next favourite.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#756a61] sm:text-base">
            Explore our full selection of burgers, grilled favourites,
            crispy chicken and sides.
          </p>
        </div>

        <nav
          aria-label="Menu categories"
          className="mt-8 flex flex-wrap gap-3"
        >
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.id}`}
              className="rounded-full border border-[#e9e0d7] px-4 py-2 text-sm font-semibold transition hover:border-[#df4428] hover:text-[#df4428]"
            >
              {category.name}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-12">
          {categories.map((category) => {
            const items = menuItems.filter(
              (item) => item.categoryId === category.id
            );

            if (items.length === 0) return null;

            return (
              <section
                key={category.id}
                id={`category-${category.id}`}
                className="scroll-mt-28"
              >
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
                  {category.name}
                </h2>

                <MenuGrid items={items} />
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}