"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navigationLinks } from "@/data/navigation";
import LocationTrigger from "@/components/location/LocationTrigger";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e9e0d7] bg-white transition hover:border-[#df4428] hover:text-[#df4428]"
      >
        {isOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(88vw,340px)] overflow-hidden rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] p-2 shadow-xl"
        >
          <div className="rounded-xl bg-[#fff0e9] px-3 py-3">
            <LocationTrigger />
          </div>

          <nav
            aria-label="Mobile navigation"
            className="mt-2 flex flex-col gap-1"
          >
            {navigationLinks.map((item) => {
              const classes =
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#211b17] transition hover:bg-[#fff0e9] hover:text-[#c43b22]";

              return item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                  <ArrowUpRight size={16} />
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={classes}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="px-4 pb-2 pt-3 text-xs text-[#756a61]">
            Freshly prepared. Ready when you are.
          </p>
        </div>
      )}
    </div>
  );
}