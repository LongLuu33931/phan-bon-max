import Link from "next/link";
import type { ReactNode } from "react";
import { supabaseConfigured } from "@/lib/supabase";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/posts", label: "Tin tức" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/admin" className="text-xl font-black text-emerald-900">MAX 8000 CMS</Link>
          <nav className="flex flex-wrap gap-2 text-sm font-semibold">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md border border-stone-200 bg-white px-3 py-2 text-stone-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {!supabaseConfigured ? (
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
            CMS đang chạy ở chế độ demo vì chưa có Supabase env. Public site dùng seed data, form CMS sẽ lưu vào Supabase sau khi cấu hình.
          </div>
        </div>
      ) : null}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
