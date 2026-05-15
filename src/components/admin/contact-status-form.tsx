"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useActionToast } from "@/hooks/use-action-toast";
import { updateContactMessageStatus, type ActionState } from "@/lib/actions";
import type { ContactMessage } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };

const statusOptions: Array<{ value: ContactMessage["status"]; label: string }> = [
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "closed", label: "Đã xử lý" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-xl bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {pending ? "Đang lưu" : "Cập nhật"}
    </button>
  );
}

export function ContactStatusForm({ messageId, status }: { messageId: string; status: ContactMessage["status"] }) {
  const [state, formAction] = useActionState(updateContactMessageStatus, initialState);
  useActionToast(state);

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="id" value={messageId} />
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
