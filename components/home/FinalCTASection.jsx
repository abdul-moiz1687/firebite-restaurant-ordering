import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flame } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section
      className="firebite-final-cta bg-[#201510] px-4 pt-10 sm:px-8 sm:pt-14"
      aria-labelledby="firebite-final-cta-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-t-[2rem] border border-white/10 border-b-0 bg-[#2b1a13] sm:rounded-t-[2.75rem]">
          <Image
            src="/images/grilled-meat-vegetable-skewers-with-smoke-hero.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px"
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 z-0 bg-[linear-gradient(105deg,rgba(32,21,16,0.98)_0%,rgba(32,21,16,0.91)_48%,rgba(32,21,16,0.42)_100%)]" />
          <div className="relative z-10 grid gap-9 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:px-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-xs font-black tracking-[0.22em] text-orange-300 sm:text-sm">
                <Flame size={16} aria-hidden="true" />
                SAVE ROOM FOR SOMETHING GOOD
              </p>
              <h2
                id="firebite-final-cta-title"
                className="mt-5 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-[#fffdf9] sm:text-5xl md:text-6xl lg:text-7xl"
              >
                YOUR NEXT FAVOURITE
                <span className="mt-2 block text-[#ff704b]">BITE IS CALLING.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                Bring on the crunch, turn up the flavour, and find your next go-to meal.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[190px] lg:flex-col">
              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df4428] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#bd321b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                START YOUR ORDER
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/our-story"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-4 text-sm font-bold text-white transition duration-200 hover:border-white hover:bg-white/10"
              >
                OUR STORY
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4 text-[10px] font-bold tracking-[0.19em] text-white/55 sm:px-10 lg:px-16">
            <span>FIREBITE · GRILL · BBQ · BURGERS</span>
            <span className="hidden sm:inline">FOLLOW THE FLAVOUR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
