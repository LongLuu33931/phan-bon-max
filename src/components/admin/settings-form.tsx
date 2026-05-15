"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ImagePlus, Plus, Trash2, UploadCloud } from "lucide-react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { saveSiteSettings, type ActionState } from "@/lib/actions";
import type { HeroSlide, SiteSettings } from "@/lib/types";

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
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    settings.heroSlides?.length ? settings.heroSlides : [createDefaultSlide()],
  );

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="logoUrl" value={settings.logoUrl} />
      <input type="hidden" name="heroSlidesJson" value={JSON.stringify(heroSlides)} />

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
              {settings.logoUrl ? (
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
                <input name="logo" type="file" accept="image/*,.svg" className={fileClass} />
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

        <div className="mt-5 grid gap-4">
          {heroSlides.map((slide, index) => (
            <div key={index} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-stone-950">Slide {index + 1}</p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">{slide.isActive ? "Đang hiển thị" : "Đang ẩn"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHeroSlides((slides) => slides.filter((_, slideIndex) => slideIndex !== index))}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-black text-red-700"
                >
                  <Trash2 size={14} /> Xóa
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-stone-200 bg-white">
                  {slide.imageUrl ? (
                    <Image src={slide.imageUrl} alt={`Hero slide ${index + 1}`} fill sizes="340px" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-stone-400">
                      <ImagePlus size={42} />
                    </div>
                  )}
                </div>

                <div className="grid content-center gap-4">
                  <label className={labelClass}>
                    Upload ảnh slide
                    <input name={`heroImage-${index}`} type="file" accept="image/*" className={fileClass} />
                  </label>
                  <label className="flex h-12 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 text-sm font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={slide.isActive}
                      onChange={(event) => setHeroSlides((slides) => updateSlide(slides, index, { isActive: event.target.checked }))}
                      className="size-4 accent-emerald-800"
                    />
                    Hiển thị slide
                  </label>
                </div>
              </div>
            </div>
          ))}
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
