import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
};

export function AdminPageHeader({ eyebrow, title, badge, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">{title}</h1>
      </div>
      {badge ?? action ?? null}
    </div>
  );
}
