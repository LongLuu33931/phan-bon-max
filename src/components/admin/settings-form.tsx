"use client";

import Image from "next/image";
import { useActionState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { saveSiteSettings, type ActionState } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";
const fileClass = "rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-900 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, isPending] = useActionState(saveSiteSettings, initialState);

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="logoUrl" value={settings.logoUrl} />

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
