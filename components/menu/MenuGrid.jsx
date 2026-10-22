
import Image from "next/image";
import { Flame } from "lucide-react";
import { categories } from "@/data/menu";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function MenuGrid({ items }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const category = categories.find(
          (entry) => entry.id === item.categoryId
        );

        return (
          <article
            key={item.id}
            className="group/card flex h-full flex-col overflow-hidden rounded-3xl border border-[#e9e0d7] bg-white shadow-[0_4px_20px_rgba(49,31,21,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#df4428]/40 hover:shadow-[0_16px_36px_rgba(49,31,21,0.12)] motion-reduce:transform-none motion-reduce:transition-none"
          >
            <div className="group/image relative h-56 overflow-hidden bg-[#f6f0e9] sm:h-60">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#201713]/30 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover/card:opacity-100" />

              {item.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-[#df4428] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-lg">
                  {item.badge}
                </span>
              )}

              <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/40 bg-white/90 text-[#df4428] shadow-sm backdrop-blur-sm transition duration-300 group-hover/card:rotate-12 group-hover/card:bg-[#df4428] group-hover/card:text-white">
                <Flame size={17} strokeWidth={2.4} />
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <p className="inline-flex w-fit items-center rounded-full bg-[#fff1eb] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#c93b22]">
                {category?.name ?? "Menu"}
              </p>

              <h3 className="mt-3 line-clamp-2 text-lg font-extrabold tracking-tight text-[#241b17] transition-colors duration-200 group-hover/card:text-[#df4428]">
                {item.name}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-[#756a61]">
                {item.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#f0e7df] pt-4">
                <span className="text-base font-black tracking-tight text-[#241b17] sm:text-lg">
                  Rs. {item.price.toLocaleString("en-PK")}
                </span>

                <AddToCartButton product={item} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
