"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type FormActionsProps = {
  children: React.ReactNode;
  message?: string;
  ok?: boolean;
};

export function AdminFormActions({ children, message, ok }: FormActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm font-black text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
      >
        <ArrowLeft size={17} /> Quay lại
      </button>
      {message ? (
        <p className={`${ok ? "text-emerald-700" : "text-amber-700"} text-sm font-bold sm:flex-1`}>
          {message}
        </p>
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}
      <div className="flex justify-end sm:ml-auto">{children}</div>
    </div>
  );
}
