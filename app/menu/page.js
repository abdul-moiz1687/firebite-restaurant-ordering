import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { menuItems, categories } from "@/data/menu";
import MenuExplorer from "@/components/menu/MenuExplorer";

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

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#241b17] sm:text-5xl">
            Find your next favourite.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#756a61] sm:text-base">
            Explore our full selection of burgers, grilled favourites,
            crispy chicken and sides.
          </p>
        </div>

        <MenuExplorer items={menuItems} categories={categories} />
      </div>
    </main>
  );
}
