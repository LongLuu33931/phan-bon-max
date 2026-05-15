"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type FormActionsProps = {
  children: React.ReactNode;
  message?: string;
  ok?: boolean;
};

export function AdminFormActions({ children }: FormActionsProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.18)] backdrop-blur sm:flex-row sm:items-center lg:left-80 lg:right-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-black text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
      >
        <ArrowLeft size={17} /> Quay lại
      </button>
      <span className="hidden sm:block sm:flex-1" />
      <div className="flex justify-end sm:ml-auto">{children}</div>
    </div>
  );
}
