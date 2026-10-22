"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { heroSlides } from "@/data/heroSlides";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex(
        (currentIndex) => (currentIndex + 1) % heroSlides.length
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[activeIndex];

  function showPrevious() {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex - 1 + heroSlides.length) % heroSlides.length
    );
  }

  function showNext() {
    setActiveIndex(
      (currentIndex) => (currentIndex + 1) % heroSlides.length
    );
  }

  return (
    <section
      aria-label="Featured food"
      aria-roledescription="carousel"
      className="relative isolate min-h-[600px] overflow-hidden bg-[#201510] text-white md:min-h-[680px]"
    >
      {/* Background images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt={index === activeIndex ? slide.imageAlt : ""}
            fill
            sizes="100vw"
            preload={index === 0}
            className={`object-cover object-center transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Dark overlay makes text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      {/* Active slide content */}
      <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-center px-5 py-20 sm:px-8 md:min-h-[680px]">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-orange-300 sm:text-sm">
            {activeSlide.eyebrow}
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            {activeSlide.title}
            <span className="mt-2 block text-orange-400">
              {activeSlide.highlight}
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
            {activeSlide.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#df4428] px-6 py-4 font-semibold text-white transition hover:bg-[#bd321b]"
            >
              Explore menu
              <ArrowUpRight size={19} />
            </Link>

            <button
              type="button"
              onClick={showNext}
              className="rounded-full border border-white/40 px-6 py-4 font-semibold transition hover:bg-white/10"
            >
              Discover more
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 transition hover:bg-white/15"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="flex items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-9 bg-orange-400"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 transition hover:bg-white/15"
            >
              <ArrowRight size={19} />
            </button>

            <span className="sr-only" aria-live="polite">
              Slide {activeIndex + 1} of {heroSlides.length}:{" "}
              {activeSlide.title} {activeSlide.highlight}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}