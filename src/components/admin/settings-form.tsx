"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, UploadCloud } from "lucide-react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { useActionToast } from "@/hooks/use-action-toast";
import { saveSiteSettings, type ActionState } from "@/lib/actions";
import type { HeroSlide, PromoPopupCta, SiteSettings } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";
const fileClass = "rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-900 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white";

function createDefaultSlide(): HeroSlide {
  return {
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: "",
    primaryLabel: "",
    primaryHref: "",
    secondaryLabel: "",
    secondaryHref: "",
    isActive: true,
  };
}

function updateSlide(slides: HeroSlide[], index: number, patch: Partial<HeroSlide>) {
  return slides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide));
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, isPending] = useActionState(saveSiteSettings, initialState);
  useActionToast(state);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    settings.heroSlides?.length ? settings.heroSlides : [createDefaultSlide()],
  );
  const [logoPreview, setLogoPreview] = useState("");
  const [heroImagePreviews, setHeroImagePreviews] = useState<Record<number, string>>({});
  const [popupDesktopPreview, setPopupDesktopPreview] = useState("");
  const [popupMobilePreview, setPopupMobilePreview] = useState("");
  const [popupCtas, setPopupCtas] = useState<PromoPopupCta[]>(
    settings.promoPopup.ctas?.length ? settings.promoPopup.ctas : [],
  );
  const logoPreviewRef = useRef("");
  const heroImagePreviewsRef = useRef<Record<number, string>>({});
  const popupDesktopPreviewRef = useRef("");
  const popupMobilePreviewRef = useRef("");

  useEffect(() => {
    return () => {
      if (logoPreviewRef.current) URL.revokeObjectURL(logoPreviewRef.current);
      Object.values(heroImagePreviewsRef.current).forEach((url) => URL.revokeObjectURL(url));
      if (popupDesktopPreviewRef.current) URL.revokeObjectURL(popupDesktopPreviewRef.current);
      if (popupMobilePreviewRef.current) URL.revokeObjectURL(popupMobilePreviewRef.current);
    };
  }, []);

  function previewLogo(file?: File) {
    if (logoPreviewRef.current) URL.revokeObjectURL(logoPreviewRef.current);

    const next = file ? URL.createObjectURL(file) : "";
    logoPreviewRef.current = next;
    setLogoPreview(next);
  }

  function previewHeroImage(index: number, file?: File) {
    setHeroImagePreviews((previews) => {
      const current = previews[index];
      if (current) URL.revokeObjectURL(current);

      if (!file) {
        const next = { ...previews };
        delete next[index];
        heroImagePreviewsRef.current = next;
        return next;
      }

      const next = { ...previews, [index]: URL.createObjectURL(file) };
      heroImagePreviewsRef.current = next;
      return next;
    });
  }

  function previewPopupDesktop(file?: File) {
    if (popupDesktopPreviewRef.current) URL.revokeObjectURL(popupDesktopPreviewRef.current);
    const next = file ? URL.createObjectURL(file) : "";
    popupDesktopPreviewRef.current = next;
    setPopupDesktopPreview(next);
  }

  function previewPopupMobile(file?: File) {
    if (popupMobilePreviewRef.current) URL.revokeObjectURL(popupMobilePreviewRef.current);
    const next = file ? URL.createObjectURL(file) : "";
    popupMobilePreviewRef.current = next;
    setPopupMobilePreview(next);
  }

  function removeHeroSlide(index: number) {
    setHeroSlides((slides) => slides.filter((_, slideIndex) => slideIndex !== index));
    setHeroImagePreviews((previews) => {
      const next: Record<number, string> = {};

      Object.entries(previews).forEach(([key, url]) => {
        const previewIndex = Number(key);
        if (previewIndex === index) {
          URL.revokeObjectURL(url);
          return;
        }
        next[previewIndex > index ? previewIndex - 1 : previewIndex] = url;
      });

      heroImagePreviewsRef.current = next;
      return next;
    });
  }

  function moveHeroSlide(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= heroSlides.length) return;

    setHeroSlides((slides) => {
      const next = [...slides];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });

    setHeroImagePreviews((previews) => {
      const next = { ...previews };
      const currentPreview = next[index];
      const targetPreview = next[nextIndex];

      if (targetPreview) {
        next[index] = targetPreview;
      } else {
        delete next[index];
      }

      if (currentPreview) {
        next[nextIndex] = currentPreview;
      } else {
        delete next[nextIndex];
      }

      heroImagePreviewsRef.current = next;
      return next;
    });
  }

  return (
    <form action={action} className="grid gap-5 pb-28">
      <input type="hidden" name="logoUrl" value={settings.logoUrl} />
      <input type="hidden" name="heroSlidesJson" value={JSON.stringify(heroSlides)} />
      <input type="hidden" name="promoPopupDesktopUrl" value={settings.promoPopup.desktopImageUrl} />
      <input type="hidden" name="promoPopupMobileUrl" value={settings.promoPopup.mobileImageUrl} />

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Nhận diện thương hiệu</h2>
          <p className="mt-1 text-sm text-stone-500">Logo sẽ được upload lên Supabase Storage và dùng chung cho header, footer.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            Tên thương hiệu
            <input name="brandName" defaultValue={settings.brandName} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Tagline
            <input name="tagline" defaultValue={settings.tagline} required className={inputClass} />
          </label>
          <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 lg:col-span-2 lg:grid-cols-[220px_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-white">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoPreview} alt={settings.brandName} className="h-full w-full object-contain p-4" />
              ) : settings.logoUrl ? (
                <Image src={settings.logoUrl} alt={settings.brandName} fill sizes="220px" className="object-contain p-4" />
              ) : (
                <div className="grid h-full place-items-center text-stone-400">
                  <ImagePlus size={42} />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-3">
              <div>
                <p className="text-sm font-black text-stone-950">Logo website</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">Chọn file logo mới để thay thế. CMS sẽ tự upload file lên Supabase, không cần nhập URL.</p>
              </div>
              <label className={labelClass}>
                Upload logo
                <span className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <UploadCloud size={15} /> PNG, JPG, SVG hoặc WebP
                </span>
                <input name="logo" type="file" accept="image/*,.svg" className={fileClass} onChange={(event) => previewLogo(event.target.files?.[0])} />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-black text-stone-950">Hero slider trang chủ</h2>
            <p className="mt-1 text-sm text-stone-500">Upload ảnh cho slider đầu trang. Mỗi slide chỉ cần một ảnh.</p>
          </div>
          <button
            type="button"
            onClick={() => setHeroSlides((slides) => [...slides, createDefaultSlide()])}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-stone-950 px-4 text-sm font-black text-white"
          >
            <Plus size={16} /> Thêm slide
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {heroSlides.map((slide, index) => {
            const previewUrl = heroImagePreviews[index];

            return (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-stone-200 bg-stone-50 p-3 md:grid-cols-[220px_1fr_auto] md:items-center"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-stone-200 bg-white">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt={`Hero slide ${index + 1}`} className="h-full w-full object-cover" />
                  ) : slide.imageUrl ? (
                    <Image src={slide.imageUrl} alt={`Hero slide ${index + 1}`} fill sizes="220px" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-stone-400">
                      <ImagePlus size={34} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-stone-950">Slide {index + 1}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${slide.isActive ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
                      {slide.isActive ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                  </div>
                    <input
                      name={`heroImage-${index}`}
                      type="file"
                      accept="image/*"
                      className={`${fileClass} w-full`}
                      onChange={(event) => previewHeroImage(index, event.target.files?.[0])}
                    />
                </div>

                <div className="flex items-center justify-between gap-3 md:w-40 md:flex-col md:items-stretch">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      aria-label={`Đưa slide ${index + 1} lên trước`}
                      disabled={index === 0}
                      onClick={() => moveHeroSlide(index, -1)}
                      className="grid h-9 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Đưa slide ${index + 1} xuống sau`}
                      disabled={index === heroSlides.length - 1}
                      onClick={() => moveHeroSlide(index, 1)}
                      className="grid h-9 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <label className="flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={slide.isActive}
                      onChange={(event) => setHeroSlides((slides) => updateSlide(slides, index, { isActive: event.target.checked }))}
                      className="size-4 accent-emerald-800"
                    />
                    Hiển thị
                  </label>
                  <button
                    type="button"
                    onClick={() => removeHeroSlide(index)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-black text-red-700"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
            </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Popup khuyến mãi</h2>
          <p className="mt-1 text-sm text-stone-500">Cấu hình popup khuyến mãi hiển thị trên website. Upload ảnh cho bản PC và bản mobile.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-stone-200 bg-white">
              {popupDesktopPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={popupDesktopPreview} alt="Popup khuyến mãi PC" className="h-full w-full object-cover" />
              ) : settings.promoPopup.desktopImageUrl ? (
                <Image src={settings.promoPopup.desktopImageUrl} alt="Popup khuyến mãi PC" fill sizes="400px" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-stone-400">
                  <ImagePlus size={42} />
                </div>
              )}
            </div>
            <label className={labelClass}>
              Ảnh cho PC (Desktop)
              <span className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <UploadCloud size={15} /> PNG, JPG hoặc WebP
              </span>
              <input name="popupDesktop" type="file" accept="image/*" className={fileClass} onChange={(event) => previewPopupDesktop(event.target.files?.[0])} />
            </label>
          </div>
          <div className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="relative aspect-[9/16] max-h-[400px] overflow-hidden rounded-xl border border-stone-200 bg-white">
              {popupMobilePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={popupMobilePreview} alt="Popup khuyến mãi Mobile" className="h-full w-full object-cover" />
              ) : settings.promoPopup.mobileImageUrl ? (
                <Image src={settings.promoPopup.mobileImageUrl} alt="Popup khuyến mãi Mobile" fill sizes="200px" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-stone-400">
                  <ImagePlus size={42} />
                </div>
              )}
            </div>
            <label className={labelClass}>
              Ảnh cho Mobile
              <span className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                <UploadCloud size={15} /> PNG, JPG hoặc WebP
              </span>
              <input name="popupMobile" type="file" accept="image/*" className={fileClass} onChange={(event) => previewPopupMobile(event.target.files?.[0])} />
            </label>
          </div>
        </div>

        <div className="mt-5 border-t border-stone-100 pt-5">
          <div className="mb-3">
            <h3 className="text-sm font-black text-stone-950">Nút kêu gọi hành động</h3>
            <p className="mt-0.5 text-xs text-stone-500">Chọn tối đa 2 nút hiển thị trên popup. Chỉ 2 nút đầu tiên được bật sẽ hiển thị.</p>
          </div>
          <div className="grid gap-3">
            {popupCtas.map((cta, index) => {
              const descriptions: Record<string, string> = {
                buy: "Dẫn đến trang sản phẩm",
                contact: "Dẫn đến trang liên hệ",
                call: "Gọi điện thoại trực tiếp",
                zalo: "Mở Zalo nhắn tin",
              };

              return (
                <div key={cta.type} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name={`popupCtaEnabled-${index}`}
                      type="checkbox"
                      checked={cta.enabled}
                      onChange={(e) => {
                        setPopupCtas((prev) => {
                          const next = prev.map((c, i) => (i === index ? { ...c, enabled: e.target.checked } : c));
                          return next;
                        });
                      }}
                      className="size-4 accent-emerald-800"
                    />
                    <input type="hidden" name={`popupCtaType-${index}`} value={cta.type} />
                    <span className="text-xs font-semibold text-stone-500 w-16">{descriptions[cta.type]}</span>
                  </label>
                  <input
                    name={`popupCtaLabel-${index}`}
                    value={cta.label}
                    onChange={(e) => {
                      setPopupCtas((prev) => {
                        const next = prev.map((c, i) => (i === index ? { ...c, label: e.target.value } : c));
                        return next;
                      });
                    }}
                    className="h-10 flex-1 rounded-lg border border-stone-200 bg-white px-3 text-sm font-bold text-stone-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Nhãn nút"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Thông tin liên hệ</h2>
          <p className="mt-1 text-sm text-stone-500">Dữ liệu này dùng chung cho header, footer và CTA tư vấn.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            Hotline
            <input name="hotline" defaultValue={settings.hotline} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Zalo URL
            <input name="zaloUrl" defaultValue={settings.zaloUrl} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Email
            <input name="email" type="email" defaultValue={settings.email} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Địa chỉ
            <input name="address" defaultValue={settings.address} required className={inputClass} />
          </label>
        </div>
      </section>

      <AdminFormActions message={state.message} ok={state.ok}>
        <button disabled={isPending} className="h-12 rounded-xl bg-emerald-900 px-5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-stone-300">
          {isPending ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </AdminFormActions>
    </form>
  );
}
