import Image from "next/image";
import { categories } from "@/data/menu";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function MenuGrid({ items }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const category = categories.find(
          (entry) => entry.id === item.categoryId
        );

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-[#e9e0d7] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="group relative h-56 overflow-hidden bg-[#f6f0e9]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {item.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="p-4">
              <p className="text-xs font-medium text-[#df4428]">
                {category?.name}
              </p>

              <h3 className="mt-2 text-lg font-bold">{item.name}</h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-[#756a61]">
                {item.description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e9e0d7] pt-4">
  <span className="font-extrabold">
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