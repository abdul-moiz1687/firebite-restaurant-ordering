
"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import MenuGrid from "@/components/menu/MenuGrid";

export default function MenuExplorer({ items, categories }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Search and category filtering
  const searchTerm = search.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const categoryName =
      categories.find((category) => category.id === item.categoryId)?.name ?? "";

    const searchableText =
      `${item.name} ${item.description} ${categoryName}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesCategory =
      activeCategory === "all" || item.categoryId === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Sorting without changing the original menu array
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "name":
        return a.name.localeCompare(b.name);

      case "featured":
      default:
        return (
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          a.name.localeCompare(b.name)
        );
    }
  });

  const hasActiveFilters =
    search.trim() !== "" ||
    activeCategory !== "all" ||
    sortBy !== "featured";

  function clearFilters() {
    setSearch("");
    setActiveCategory("all");
    setSortBy("featured");
  }

  return (
    <section className="mt-10">
      {/* Search and sorting controls */}
      <div className="rounded-3xl border border-[#e9e0d7] bg-white p-4 shadow-[0_4px_20px_rgba(49,31,21,0.04)] sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_230px]">
          <div>
            <label
              htmlFor="menu-search"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#756a61]"
            >
              Search menu
            </label>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a8b80]"
              />

              <input
                id="menu-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search burgers, chicken, BBQ..."
                className="h-12 w-full rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] pl-11 pr-4 text-sm text-[#241b17] outline-none transition placeholder:text-[#a3978d] focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="menu-sort"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#756a61]"
            >
              Sort by
            </label>

            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#756a61]"
              />

              <select
                id="menu-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] pl-11 pr-4 text-sm font-semibold text-[#241b17] outline-none transition focus:border-[#df4428] focus:ring-2 focus:ring-[#df4428]/10"
              >
                <option value="featured">Featured first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#756a61]">
            Browse categories
          </p>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                activeCategory === "all"
                  ? "border-[#df4428] bg-[#df4428] text-white"
                  : "border-[#e9e0d7] bg-white text-[#756a61] hover:border-[#df4428] hover:text-[#df4428]"
              }`}
            >
              All items
            </button>

            {categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? "border-[#df4428] bg-[#df4428] text-white"
                      : "border-[#e9e0d7] bg-white text-[#756a61] hover:border-[#df4428] hover:text-[#df4428]"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 mt-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            aria-live="polite"
            className="text-xs font-bold uppercase tracking-[0.16em] text-[#df4428]"
          >
            {sortedItems.length} {sortedItems.length === 1 ? "item" : "items"} found
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#241b17] sm:text-3xl">
            Explore the menu
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-bold text-[#756a61] transition hover:text-[#df4428]"
          >
            Clear filters
          </button>
        )}
      </div>

      {sortedItems.length > 0 ? (
        <MenuGrid items={sortedItems} />
      ) : (
        <div className="rounded-3xl border border-dashed border-[#dfcfc1] bg-white px-6 py-16 text-center">
          <h3 className="text-xl font-extrabold text-[#241b17]">
            No dishes found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#756a61]">
            Try a different search term or select another category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-full bg-[#df4428] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c93620]"
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
