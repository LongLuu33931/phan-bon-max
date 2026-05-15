"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { HeroSlide, Product } from "@/lib/types";
import { cn } from "@/lib/format";

type HeroSliderProps = {
  slides: HeroSlide[];
  fallbackProduct?: Product;
};

export function HeroSlider({ slides, fallbackProduct }: HeroSliderProps) {
  const activeSlides = useMemo(() => {
    const configured = slides.filter((slide) => slide.isActive && slide.imageUrl);
    if (configured.length) return configured;

    return [
      {
        eyebrow: "",
        title: "MAX 8000",
        description: "",
        imageUrl: fallbackProduct?.thumbnailUrl ?? "",
        primaryLabel: "",
        primaryHref: "",
        isActive: true,
      },
    ];
  }, [fallbackProduct?.thumbnailUrl, slides]);
  const [current, setCurrent] = useState(0);
  const currentIndex = activeSlides.length ? current % activeSlides.length : 0;

  useEffect(() => {
    if (activeSlides.length < 2) return;
    const id = window.setInterval(() => {
      setCurrent((index) => (index + 1) % activeSlides.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [activeSlides.length]);

  function move(direction: -1 | 1) {
    setCurrent((index) => (index + direction + activeSlides.length) % activeSlides.length);
  }

  return (
    <section className="bg-emerald-950 text-white">
      <div className="relative isolate grid w-full overflow-hidden bg-emerald-900">
        {activeSlides.some((item) => item.imageUrl) ? (
          activeSlides.map((item, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${item.imageUrl}-${index}`}
              src={item.imageUrl}
              alt={item.title || `Hero slide ${index + 1}`}
              className={cn(
                "col-start-1 row-start-1 block h-auto w-full transition duration-700 ease-out motion-reduce:transition-none",
                index === currentIndex
                  ? "z-10 scale-100 opacity-100"
                  : "z-0 scale-[1.01] opacity-0",
              )}
              aria-hidden={index !== currentIndex}
            />
          ))
        ) : (
          <div className="min-h-[240px] sm:min-h-[360px] lg:min-h-[560px]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-950/35 to-transparent" />

        {activeSlides.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Slide trước"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-emerald-950/60 text-white shadow-lg backdrop-blur transition hover:bg-emerald-950/80 sm:left-6 sm:size-12"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Slide sau"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-emerald-950/60 text-white shadow-lg backdrop-blur transition hover:bg-emerald-950/80 sm:right-6 sm:size-12"
            >
              <ArrowRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-emerald-950/50 px-3 py-2 backdrop-blur sm:flex">
              {activeSlides.map((item, index) => (
                <button
                  key={`${item.imageUrl}-${index}`}
                  type="button"
                  aria-label={`Chuyển đến slide ${index + 1}`}
                  onClick={() => setCurrent(index)}
                  className={cn(
                    "grid size-11 place-items-center rounded-full transition",
                    "after:block after:size-2.5 after:rounded-full after:bg-white/45 after:transition after:content-['']",
                    index === currentIndex && "after:w-8 after:bg-amber-300",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
