"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useActionToast } from "@/hooks/use-action-toast";
import { updateOrderCustomerInfo, type ActionState } from "@/lib/actions";
import type { Order } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const textareaClass = "min-h-24 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold leading-6 text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-xs font-black uppercase tracking-[0.1em] text-stone-500";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-xl bg-stone-950 px-4 text-sm font-black text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {pending ? "Đang lưu" : "Lưu thông tin"}
    </button>
  );
}

export function OrderCustomerInfoForm({ order }: { order: Order }) {
  const [state, formAction] = useActionState(updateOrderCustomerInfo, initialState);
  useActionToast(state);

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="id" value={order.id} />
      <label className={labelClass}>
        Địa chỉ giao hàng
        <input name="address" defaultValue={order.address} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Tỉnh/thành
        <input name="province" defaultValue={order.province} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Ghi chú khách hàng
        <textarea name="note" defaultValue={order.note ?? ""} className={textareaClass} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}
