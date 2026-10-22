import Link from "next/link";
import { ArrowUpRight, Flame, MapPin } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export default function SiteFooter() {
  return (
    <footer id="about" className="bg-[#211b17] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#df4428]">
              <Flame size={24} />
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight">
                {siteConfig.brandName}
              </span>
              <span className="text-[10px] tracking-[0.2em] text-white/60">
                GRILL · BBQ · BURGERS
              </span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
            Bold flavours, freshly prepared food and an ordering
            experience built around convenience.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="font-bold">Explore</h2>

          <nav aria-label="Footer navigation" className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/menu" className="transition hover:text-white">
              Full Menu
            </Link>

            <Link href="/cart" className="transition hover:text-white">
              Your Cart
            </Link>
            <Link
  href="/our-story"
  className="transition hover:text-white"
>
  Our Story
</Link>
          </nav>
        </div>

        {/* Ordering */}
        <div>
          <h2 className="font-bold">Ordering</h2>

          <p className="mt-5 text-sm leading-6 text-white/65">
            Browse the menu, add your favourites to the cart and
            complete your order online.
          </p>

          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ff9b78] transition hover:text-white"
          >
            Start your order
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Location */}
        <div>
          <h2 className="font-bold">Our Location</h2>

          <a
            href={siteConfig.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/65 transition hover:text-white"
          >
            <MapPin size={19} className="mt-0.5 shrink-0 text-[#ff9b78]" />

            <span>
              {siteConfig.address}
              <span className="mt-1 block text-xs text-[#ff9b78]">
                View on Google Maps ↗
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          © {siteConfig.copyrightYear} {siteConfig.brandName}. All rights reserved.

          <Link
            href="/menu"
            className="transition hover:text-white"
          >
            Good food starts here.
          </Link>
        </div>
      </div>
    </footer>
  );
}