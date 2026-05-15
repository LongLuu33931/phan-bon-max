"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Category, HeroSlide, Product } from "@/lib/types";
import { cn } from "@/lib/format";

type HeroSliderProps = {
  categories: Category[];
  slides: HeroSlide[];
  fallbackProduct?: Product;
  zaloUrl: string;
};

export function HeroSlider({ categories, slides, fallbackProduct, zaloUrl }: HeroSliderProps) {
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
  const slide = activeSlides[current] ?? activeSlides[0];

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
      <div className="section grid min-h-[620px] gap-0 py-6 lg:grid-cols-[280px_1fr] lg:py-8">
        <aside className="hidden overflow-hidden border border-white/15 bg-emerald-900/80 lg:block">
          <p className="border-b border-white/15 px-5 py-4 text-sm font-bold uppercase tracking-wide text-amber-200">
            Danh mục giải pháp
          </p>
          <div className="grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm font-semibold text-emerald-50 hover:bg-white/10"
              >
                {category.name}
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
          <div className="m-4 bg-amber-300 p-4 text-emerald-950">
            <p className="text-sm font-black">Tư vấn nhanh theo tình trạng vườn</p>
            <a href={zaloUrl} className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
              Gửi ảnh qua Zalo <ArrowRight size={16} />
            </a>
          </div>
        </aside>

        <div className="relative isolate min-h-[560px] overflow-hidden border border-white/10 bg-emerald-900">
          {slide.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.imageUrl}
              src={slide.imageUrl}
              alt={slide.title || `Hero slide ${current + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-950/35 to-transparent" />

          {activeSlides.length > 1 ? (
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-3">
              <button
                type="button"
                aria-label="Slide trước"
                onClick={() => move(-1)}
                className="grid size-11 place-items-center border border-white/40 bg-emerald-950/60 text-white backdrop-blur"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {activeSlides.map((item, index) => (
                  <button
                    key={`${item.imageUrl}-${index}`}
                    type="button"
                    aria-label={`Chuyển đến slide ${index + 1}`}
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "h-2.5 w-8 bg-white/35 transition",
                      index === current && "bg-amber-300",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Slide sau"
                onClick={() => move(1)}
                className="grid size-11 place-items-center border border-white/40 bg-emerald-950/60 text-white backdrop-blur"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
