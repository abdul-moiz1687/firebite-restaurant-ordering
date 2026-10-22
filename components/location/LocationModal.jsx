"use client";

import { useState } from "react";
import { MapPin, X, ArrowUpRight } from "lucide-react";
import { deliveryAreas } from "@/data/deliveryAreas";
import { siteConfig } from "@/data/siteConfig";
import { useLocation } from "@/context/LocationContext";

export default function LocationModal() {
  const {
    selectedArea,
    isModalOpen,
    isReady,
    selectArea,
    closeModal,
  } = useLocation();

const [pendingAreaId, setPendingAreaId] = useState(
  selectedArea?.id ?? ""
);

  if (!isReady || !isModalOpen) {
    return null;
  }

function handleClose() {
  setPendingAreaId(selectedArea?.id ?? "");
  closeModal();
}

  function handleSubmit(event) {
    event.preventDefault();

    const area = deliveryAreas.find(
      (item) => item.id === pendingAreaId
    );

    if (area) {
      selectArea(area);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-title"
        className="relative w-full max-w-md rounded-3xl bg-[#fffdf9] p-6 text-[#211b17] shadow-2xl sm:p-8"
      >
        {selectedArea && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close location selection"
            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e9] text-[#df4428]">
          <MapPin size={25} />
        </div>

        <p className="mt-5 text-xs font-bold tracking-[0.18em] text-[#df4428]">
          DELIVERY LOCATION
        </p>

        <h2
          id="location-title"
          className="mt-2 text-3xl font-black tracking-tight"
        >
          Where should we deliver?
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#756a61]">
          Choose your area to continue to the menu. These are sample
          Karachi areas for the demo; actual delivery coverage can
          be configured later.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label
            htmlFor="delivery-area"
            className="mb-2 block text-sm font-semibold"
          >
            Select your area
          </label>

          <select
            id="delivery-area"
            value={pendingAreaId}
            onChange={(event) =>
              setPendingAreaId(event.target.value)
            }
            required
            className="w-full rounded-xl border border-[#e9e0d7] bg-white px-4 py-4 text-sm outline-none transition focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/15"
          >
            <option value="" disabled>
              Choose a delivery area
            </option>

            {deliveryAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!pendingAreaId}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#df4428] px-5 py-4 font-bold text-white transition hover:bg-[#bd321b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm location
            <ArrowUpRight size={18} />
          </button>
        </form>

        <a
          href={siteConfig.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#756a61] transition hover:text-[#df4428]"
        >
          <MapPin size={16} />
          View Mehmoodabad on Google Maps
          <ArrowUpRight size={15} />
        </a>
      </section>
    </div>
  );
}