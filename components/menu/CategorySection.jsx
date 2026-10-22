import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/menu";

const categoryIcons = {
  burgers: "🍔",
  bbq: "🔥",
  chicken: "🍗",
  sides: "🥤",
};

export default function CategorySection() {
  return (
    <section
      id="menu"
      aria-labelledby="category-heading"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#df4428]">
              FIND YOUR FAVOURITE
            </p>

            <h2
              id="category-heading"
              className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
            >
              What are you craving?
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#756a61] sm:text-base">
              From crispy chicken to smoky BBQ, explore the menu
              and find something worth craving.
            </p>
          </div>

          <Link
            href="#popular"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#df4428] hover:text-[#bd321b]"
          >
            View favourites <ArrowUpRight size={17} />
          </Link>
        </div>

       <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
  {categories.map((category, index) => (
    <Link
      key={category.id}
      href="#popular"
      className="group rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] p-5 transition hover:-translate-y-1 hover:border-[#df4428]/50 hover:shadow-lg sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-[#df4428]">
          0{index + 1}
        </span>

        <ArrowUpRight
          size={19}
          className="text-[#df4428] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <h3 className="mt-8 font-bold sm:text-lg">
        {category.name}
      </h3>

      <p className="mt-2 text-xs text-[#756a61] sm:text-sm">
        Explore menu
      </p>
    </Link>
  ))}
</div>
      </div>
    </section>
  );
}