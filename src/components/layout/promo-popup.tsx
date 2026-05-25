"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PromoPopup } from "@/lib/types";

export function PromoPopup({ promoPopup }: { promoPopup: PromoPopup }) {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function detectImage() {
      const isMobile = window.innerWidth < 768;
      const url = isMobile
        ? promoPopup.mobileImageUrl
        : promoPopup.desktopImageUrl;
      setImageUrl(url || null);
    }

    detectImage();
    window.addEventListener("resize", detectImage);
    return () => window.removeEventListener("resize", detectImage);
  }, [promoPopup.desktopImageUrl, promoPopup.mobileImageUrl]);

  useEffect(() => {
    if (!promoPopup.desktopImageUrl && !promoPopup.mobileImageUrl) return;

    const urls = [promoPopup.desktopImageUrl, promoPopup.mobileImageUrl]
      .filter(Boolean) as string[];
    const uniqueUrls = [...new Set(urls)];

    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    uniqueUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount >= uniqueUrls.length) setLoaded(true);
      };
      imgs.push(img);
    });

    setLoaded(uniqueUrls.length === 0);

    return () => {
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [promoPopup.desktopImageUrl, promoPopup.mobileImageUrl]);

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!imageUrl || closed) return;

    setShouldShow(false);
    let scrollFired = false;

    function onScrollTrigger() {
      if (scrollFired || closed) return;
      scrollFired = true;
      setShouldShow(true);
    }

    window.addEventListener("show-promo-popup", onScrollTrigger);

    const timer = setTimeout(() => {
      if (!scrollFired) setShouldShow(true);
    }, 15000);

    return () => {
      window.removeEventListener("show-promo-popup", onScrollTrigger);
      clearTimeout(timer);
    };
  }, [imageUrl, closed]);

  useEffect(() => {
    if (shouldShow && loaded) setVisible(true);
  }, [shouldShow, loaded]);

  const close = useCallback(() => {
    setVisible(false);
    setClosed(true);
  }, []);

  if (!imageUrl || !visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <button
          onClick={close}
          aria-label="Đóng popup"
          className="absolute -right-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full border-2 border-white bg-stone-900 text-white shadow-lg transition hover:bg-red-600"
        >
          <X size={16} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Khuyến mãi"
          className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}
