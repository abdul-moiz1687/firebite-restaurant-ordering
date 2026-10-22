import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  CookingPot,
  HeartHandshake,
} from "lucide-react";

const values = [
  {
    number: "01",
    title: "Flavour comes first",
    description:
      "Bold seasoning, satisfying combinations and food worth coming back for.",
    Icon: Flame,
  },
  {
    number: "02",
    title: "Made to enjoy",
    description:
      "A menu built around familiar favourites, from crispy chicken to smoky BBQ.",
    Icon: CookingPot,
  },
  {
    number: "03",
    title: "Ordering made simple",
    description:
      "A straightforward experience that helps you find your favourites and place your order.",
    Icon: HeartHandshake,
  },
];

export default function OurStoryContent() {
  return (
    <main className="bg-[#fffdf9] text-[#211b17]">
      {/* Story hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] text-[#df4428]">
            THE STORY BEHIND FIREBITE
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">
            Good food.
            <span className="mt-2 block text-[#df4428]">
              No unnecessary fuss.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#756a61] sm:text-lg">
            Firebite is built around a simple idea: great food should
            feel exciting, satisfying and easy to order. From crispy
            chicken to smoky grilled favourites, every part of the
            experience should make choosing your next meal simple.
          </p>

          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#df4428] px-6 py-4 font-bold text-white transition hover:bg-[#bd321b]"
          >
            Explore our menu
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Brand visual */}
        <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#211b17] p-7 text-white sm:min-h-[400px] sm:p-10">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full border-[45px] border-[#df4428]/15" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#df4428]">
            <Flame size={34} />
          </div>

          <div className="relative mt-16">
            <p className="text-xs font-bold tracking-[0.22em] text-[#ffad8b]">
              OUR PHILOSOPHY
            </p>

            <p className="mt-4 max-w-md text-3xl font-black leading-tight sm:text-4xl">
              Big flavour.
              <span className="block text-[#ffad8b]">
                Every bite.
              </span>
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              A food experience centred on flavour, convenience and
              the joy of finding your next favourite.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-[#e9e0d7] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.22em] text-[#df4428]">
              WHAT WE BELIEVE
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Simple ideas. Better experiences.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#756a61] sm:text-base">
              The Firebite experience is built around three principles
              that guide how the brand presents its food and makes
              ordering feel effortless.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {values.map(({ number, title, description, Icon }) => (
              <article
                key={number}
                className="rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#df4428]">
                    {number}
                  </span>

                  <Icon size={23} className="text-[#df4428]" />
                </div>

                <h3 className="mt-7 text-xl font-bold">{title}</h3>

                <p className="mt-3 text-sm leading-7 text-[#756a61]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-[#211b17] p-7 text-white sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#ffad8b]">
              READY FOR YOUR NEXT FAVOURITE?
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Let&apos;s get to the good part.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
              Explore the menu and find something that hits the spot.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#df4428] px-6 py-4 font-bold transition hover:bg-[#bd321b]"
          >
            Browse the menu
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}