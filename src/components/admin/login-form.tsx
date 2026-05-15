"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { supabaseConfigured } from "@/lib/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function login(formData: FormData) {
    startTransition(async () => {
      if (!supabaseConfigured) {
        setMessage("Chưa cấu hình đăng nhập.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });

      if (error) {
        setMessage("Email hoặc mật khẩu chưa đúng.");
        return;
      }

      const next = searchParams.get("next");
      window.location.href = next?.startsWith("/admin") ? next : "/admin";
    });
  }

  return (
    <form action={login} className="mt-6 grid gap-4">
      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        Email
        <input name="email" type="email" required className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-stone-700">
        Mật khẩu
        <input name="password" type="password" required className="h-11 rounded-md border border-stone-300 px-3 font-normal" />
      </label>
      <button disabled={isPending} className="h-11 rounded-md bg-emerald-800 px-4 font-semibold text-white disabled:bg-stone-300">
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      {message ? <p className="text-sm font-semibold text-amber-700">{message}</p> : null}
    </form>
  );
}
