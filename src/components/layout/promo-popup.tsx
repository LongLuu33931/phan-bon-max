"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PromoPopup } from "@/lib/types";

function normalizePhone(phone: string) {
  const cleaned = phone.trim().replace(/[^\d+]/g, "");
  return cleaned;
}

function getCtaHref(type: string, hotline: string, zaloUrl: string) {
  switch (type) {
    case "buy":
      return "/products";
    case "contact":
      return "/contact";
    case "call":
      return `tel:${normalizePhone(hotline)}`;
    case "zalo":
      return zaloUrl;
    default:
      return "#";
  }
}

export function PromoPopup({
  promoPopup,
  hotline,
  zaloUrl,
}: {
  promoPopup: PromoPopup;
  hotline: string;
  zaloUrl: string;
}) {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);

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
    if (!imageUrl || closed) return;

    let scrollFired = false;

    function onScrollTrigger() {
      if (scrollFired || closed) return;
      scrollFired = true;
      setVisible(true);
    }

    window.addEventListener("show-promo-popup", onScrollTrigger);

    const timer = setTimeout(() => {
      if (!scrollFired) setVisible(true);
    }, 25000);

    return () => {
      window.removeEventListener("show-promo-popup", onScrollTrigger);
      clearTimeout(timer);
    };
  }, [imageUrl, closed]);

  const close = useCallback(() => {
    setVisible(false);
    setClosed(true);
  }, []);

  if (!imageUrl || !visible) return null;

  const activeCtas = promoPopup.ctas?.filter((c) => c.enabled).slice(0, 2) ?? [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-4">
      <div className="relative flex max-h-[95svh] w-full max-w-[430px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:max-w-3xl">
        <button
          onClick={close}
          aria-label="Đóng popup"
          className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full border-2 border-white bg-stone-900 text-white shadow-lg transition hover:bg-red-600"
        >
          <X size={16} />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Khuyến mãi"
          className="block max-h-[calc(95svh-8.5rem)] w-full object-contain md:max-h-[72vh]"
        />

        {activeCtas.length > 0 && (
          <div className="flex shrink-0 flex-col gap-2 p-4 md:flex-row">
            {activeCtas.map((cta, index) => {
              const href = getCtaHref(cta.type, hotline, zaloUrl);
              const isPrimary =
                cta.type === "buy" || (index === 0 && cta.type !== "call" && cta.type !== "zalo");

              return (
                <a
                  key={cta.type}
                  href={href}
                  target={cta.type === "zalo" ? "_blank" : undefined}
                  rel={cta.type === "zalo" ? "noopener noreferrer" : undefined}
                  onClick={close}
                  className={
                    isPrimary
                      ? "flex-1 rounded-xl bg-emerald-800 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-emerald-900"
                      : "flex-1 rounded-xl border-2 border-emerald-800 bg-white px-4 py-3 text-center text-sm font-black text-emerald-800 transition hover:bg-emerald-50"
                  }
                >
                  {cta.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
