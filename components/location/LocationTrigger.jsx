"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

export default function LocationTrigger() {
  const { selectedArea, openModal } = useLocation();

  return (
    <button
      type="button"
      onClick={openModal}
      aria-haspopup="dialog"
      className="flex items-center gap-2 text-left"
    >
      <MapPin size={20} className="shrink-0 text-[#df4428]" />

      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#756a61]">
          Deliver to
        </span>

        <span className="block max-w-28 truncate text-sm font-bold">
          {selectedArea?.name ?? "Choose area"}
        </span>
      </span>

      <ChevronDown size={15} className="hidden text-[#756a61] sm:block" />
    </button>
  );
}