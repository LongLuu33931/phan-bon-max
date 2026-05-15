"use client";

import { useActionState } from "react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { saveTestimonial, type ActionState } from "@/lib/actions";
import type { Testimonial } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "rounded-xl border border-stone-200 bg-white px-4 py-3 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const [state, action, isPending] = useActionState(saveTestimonial, initialState);

  return (
    <form action={action} className="grid gap-5">
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Thông tin khách hàng</h2>
          <p className="mt-1 text-sm text-stone-500">Các trường này dùng để hiển thị khu vực trải nghiệm khách hàng ngoài trang chủ.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            Tên khách hàng
            <input name="customerName" defaultValue={testimonial?.customerName} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Vai trò/mô tả
            <input name="role" defaultValue={testimonial?.role} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Tỉnh/thành
            <input name="province" defaultValue={testimonial?.province} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Loại cây/vườn
            <input name="crop" defaultValue={testimonial?.crop} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Rating
            <input name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? 5} required className={inputClass} />
          </label>
          <label className={labelClass}>
            Thứ tự hiển thị
            <input name="sortOrder" type="number" min={0} defaultValue={testimonial?.sortOrder ?? 0} className={inputClass} />
          </label>
          <label className={`${labelClass} lg:col-span-2`}>
            Ảnh đại diện/ảnh vườn URL
            <input name="avatarUrl" defaultValue={testimonial?.avatarUrl} className={inputClass} />
          </label>
          <label className={`${labelClass} lg:col-span-2`}>
            Nội dung feedback
            <textarea name="quote" rows={5} defaultValue={testimonial?.quote} required className={textareaClass} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <h2 className="text-lg font-black text-stone-950">Trạng thái hiển thị</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700">
            <input name="isFeatured" type="checkbox" defaultChecked={testimonial?.isFeatured ?? true} value="true" className="size-4 accent-emerald-800" />
            Hiển thị nổi bật ngoài trang chủ
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700">
            <input name="isActive" type="checkbox" defaultChecked={testimonial?.isActive ?? true} value="true" className="size-4 accent-emerald-800" />
            Đang hiển thị
          </label>
        </div>
      </section>

      <AdminFormActions message={state.message} ok={state.ok}>
        <button disabled={isPending} className="h-12 rounded-xl bg-emerald-900 px-5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-stone-300">
          {isPending ? "Đang lưu..." : "Lưu feedback"}
        </button>
      </AdminFormActions>
    </form>
  );
}
