"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useActionToast } from "@/hooks/use-action-toast";
import { updateOrderStatus, type ActionState } from "@/lib/actions";
import type { Order } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };

const statusOptions: Array<{ value: Order["status"]; label: string }> = [
  { value: "new", label: "Mới" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Đã giao hàng" },
  { value: "cancelled", label: "Hủy" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {pending ? "Đang lưu" : "Cập nhật"}
    </button>
  );
}

export function OrderStatusForm({ orderId, status }: { orderId: string; status: Order["status"] }) {
  const [state, formAction] = useActionState(updateOrderStatus, initialState);
  useActionToast(state);

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="id" value={orderId} />
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm font-bold text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        >
          {statusOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <SubmitButton />
      </div>
    </form>
  );
}
