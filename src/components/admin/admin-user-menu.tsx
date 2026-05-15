"use client";

import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export function AdminUserMenu({ initials, email }: { initials: string; email: string }) {
  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-stone-50 focus:bg-stone-50 focus:outline-none"
      >
        <span className="grid size-10 place-items-center rounded-full bg-emerald-50 text-sm font-black text-emerald-900">
          {initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block text-sm font-black leading-5 text-stone-950">Quản trị</span>
          <span className="block max-w-44 truncate text-xs font-medium text-stone-500">{email}</span>
        </span>
      </button>

      <div className="invisible absolute right-0 top-full z-30 w-56 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-xl border border-stone-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="border-b border-stone-100 px-3 py-2">
            <p className="text-sm font-black text-stone-950">Quản trị</p>
            <p className="mt-0.5 truncate text-xs font-medium text-stone-500">{email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-2 flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-bold text-stone-700 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
