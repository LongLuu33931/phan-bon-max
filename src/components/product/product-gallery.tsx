"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

type GalleryImage = {
  url: string;
  alt: string;
};

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => {
    const entries: GalleryImage[] = [
      ...(product.thumbnailUrl ? [{ url: product.thumbnailUrl, alt: product.name }] : []),
      ...product.images.map((image) => ({
        url: image.url,
        alt: image.alt || product.name,
      })),
    ];

    return entries.filter((image, index, list) => list.findIndex((item) => item.url === image.url) === index);
  }, [product.images, product.name, product.thumbnailUrl]);

  const [current, setCurrent] = useState(0);
  const activeIndex = images.length ? Math.min(current, images.length - 1) : 0;
  const activeImage = images[activeIndex];

  function move(direction: -1 | 1) {
    if (images.length < 2) return;
    setCurrent((index) => (index + direction + images.length) % images.length);
  }

  return (
    <div className="min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-white">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={activeImage.alt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-contain p-4"
          />
        ) : (
          <ProductFallback product={product} />
        )}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Anh truoc"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-stone-200 bg-white/90 text-stone-900 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:text-emerald-800 sm:left-4"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Anh tiep theo"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-stone-200 bg-white/90 text-stone-900 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:text-emerald-800 sm:right-4"
            >
              <ArrowRight size={20} />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={image.url}
              type="button"
              aria-label={`Chon anh san pham ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-white transition",
                index === activeIndex
                  ? "border-emerald-800 ring-2 ring-emerald-800/20"
                  : "border-stone-200 hover:border-emerald-300",
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductFallback({ product }: { product: Product }) {
  return (
    <div className="flex h-full min-h-64 w-full min-w-0 flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#f7f3e8_0%,#dce9d3_52%,#f2c766_100%)] p-6 text-emerald-950">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
        <span>MAX 8000</span>
        <Leaf size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-600">Phan bon the he moi</p>
        <p className="mt-2 break-words text-2xl font-black leading-tight sm:text-3xl">{product.name.split(" - ")[0]}</p>
      </div>
      <div className="break-words rounded-md bg-white/70 p-3 text-sm font-semibold text-stone-700 shadow-sm">
        {product.shortDescription}
      </div>
    </div>
  );
}
