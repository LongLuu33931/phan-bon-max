import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { supabaseConfigured } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (user) redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
        <h1 className="text-2xl font-black text-stone-950">Đăng nhập</h1>
        <LoginForm />
      </section>
    </main>
  );
}
