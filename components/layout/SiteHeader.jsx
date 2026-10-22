import Link from "next/link";
import { Flame, ArrowUpRight } from "lucide-react";

import LocationTrigger from "@/components/location/LocationTrigger";
import CartLink from "@/components/cart/CartLink";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { navigationLinks } from "@/data/navigation";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e9e0d7]/80 bg-[#fffdf9]/95 shadow-[0_4px_24px_-20px_rgba(33,27,23,0.45)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label="Firebite home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#df4428] text-white shadow-sm shadow-[#df4428]/20">
            <Flame size={23} />
          </span>

          <span>
            <span className="block text-lg font-black leading-tight tracking-tight">
              FIREBITE
            </span>

            <span className="block whitespace-nowrap text-[9px] font-semibold tracking-[0.16em] text-[#756a61]">
              GRILL · BBQ · BURGERS
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-[#e9e0d7]/80 bg-white/70 p-1 lg:flex"
        >
          {navigationLinks.map((item) => {
            const linkClasses =
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-semibold text-[#51463e] transition duration-200 hover:bg-[#fff0e9] hover:text-[#c43b22] xl:px-3.5";

            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                {item.label}
                <ArrowUpRight size={13} />
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={linkClasses}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Location, cart and order CTA */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center border-l border-[#e9e0d7] pl-3 xl:flex">
            <LocationTrigger />
          </div>

          <CartLink />

          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-[#df4428] px-3 py-3 text-sm font-bold text-white shadow-sm shadow-[#df4428]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#bd321b] hover:shadow-md sm:px-5"
          >
            <span className="sm:hidden">Order</span>
            <span className="hidden sm:inline">Order Now</span>
            <ArrowUpRight size={16} />
          </Link>

          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}