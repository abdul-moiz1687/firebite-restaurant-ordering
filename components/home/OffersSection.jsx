import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  UsersRound,
  UtensilsCrossed,
  Check,
} from "lucide-react";

import { offers } from "@/data/offers";

const offerIcons = {
  solo: UtensilsCrossed,
  bbq: Flame,
  crunch: UsersRound,
};

export default function OffersSection() {
  return (
    <section
      id="offers"
      aria-labelledby="offers-heading"
      className="scroll-mt-24 border-y border-[#e9e0d7] bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#df4428]">
              GOOD FOOD, GOOD COMBINATIONS
            </p>

            <h2
              id="offers-heading"
              className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
            >
              Make it a combo.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#756a61] sm:text-base">
              Whether it is a solo craving or a table full of
              favourites, find a combination that suits your mood.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#df4428] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bd321b]"
          >
            Explore full menu
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer) => {
            const Icon = offerIcons[offer.icon];

            return (
              <article
                key={offer.id}
                className="group rounded-3xl border border-[#e9e0d7] bg-[#fffdf9] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#df4428]/40 hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#fff0e9] px-3 py-2 text-[10px] font-bold tracking-[0.15em] text-[#c43b22]">
                    {offer.label}
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#df4428] ring-1 ring-[#e9e0d7]">
                    <Icon size={21} />
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-tight">
                  {offer.name}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-[#756a61]">
                  {offer.description}
                </p>

                <ul className="mt-5 space-y-3">
                  {offer.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#51463e]"
                    >
                      <Check
                        size={16}
                        className="shrink-0 text-[#df4428]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/menu"
                  className="mt-7 inline-flex items-center gap-2 border-t border-[#e9e0d7] pt-5 text-sm font-bold text-[#df4428] transition group-hover:text-[#bd321b]"
                >
                  Choose your food
                  <ArrowUpRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}