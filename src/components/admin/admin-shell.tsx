import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Leaf, Menu } from "lucide-react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { getAdminNotificationCounts, getSettings } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export async function AdminShell({ children }: { children: ReactNode }) {
  let adminEmail = "admin";

  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (!user) redirect("/login");
    adminEmail = user.email ?? "admin";
  }

  const [settings, counts] = await Promise.all([getSettings(), getAdminNotificationCounts()]);
  const initials = getInitials(settings.brandName) || "M8";

  return (
    <div className="min-h-screen bg-[#f6f6f4] text-stone-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-emerald-100 bg-white lg:block">
        <Link href="/admin" className="flex h-20 items-center gap-3 border-b border-emerald-100 px-6">
          {settings.logoUrl ? (
            <span className="grid size-11 place-items-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-emerald-100">
              <Image
                src={settings.logoUrl}
                alt={settings.brandName}
                width={72}
                height={72}
                className="h-10 w-10 object-contain"
              />
            </span>
          ) : (
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <Leaf size={23} />
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-lg font-black tracking-tight">{settings.brandName}</span>
            <span className="block truncate text-xs font-semibold text-stone-500">{settings.tagline}</span>
          </span>
        </Link>
        <AdminNavigation counts={counts} />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <button className="grid size-11 place-items-center rounded-lg border border-stone-200 bg-white text-stone-600 lg:hidden" aria-label="Mở menu">
              <Menu size={21} />
            </button>
            <div className="ml-auto flex items-center">
              <AdminUserMenu initials={initials} email={adminEmail} />
            </div>
          </div>
        </header>

        {!supabaseConfigured ? (
          <div className="px-4 pt-5 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
              CMS đang chạy ở chế độ demo vì chưa có Supabase env. Sau khi cấu hình Supabase, dữ liệu từ form sẽ lưu vào database và storage.
            </div>
          </div>
        ) : null}

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
