"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { saveContactMessage, type ActionState } from "@/lib/actions";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "rounded-xl border border-stone-200 bg-white px-4 py-3 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";

export function ContactForm() {
  const [state, action, isPending] = useActionState(saveContactMessage, initialState);

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div>
        <h2 className="text-xl font-black text-stone-950">Gửi thông tin cần tư vấn</h2>
        <p className="mt-1 text-sm leading-6 text-stone-500">MAX 8000 sẽ liên hệ lại sau khi nhận thông tin.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Họ tên
          <input name="customerName" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Số điện thoại
          <input name="phone" required inputMode="tel" className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" className={inputClass} />
        </label>
        <label className={labelClass}>
          Tỉnh/thành
          <input name="province" className={inputClass} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Loại cây/vườn đang chăm
          <input name="crop" placeholder="Ví dụ: sầu riêng, cà phê, hồ tiêu..." className={inputClass} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Nội dung cần tư vấn
          <textarea name="message" rows={5} required className={textareaClass} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={isPending} className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-900 px-5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:bg-stone-300">
          <Send size={17} /> {isPending ? "Đang gửi..." : "Gửi liên hệ"}
        </button>
        {state.message ? (
          <p className={state.ok ? "text-sm font-bold text-emerald-700" : "text-sm font-bold text-amber-700"}>
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
