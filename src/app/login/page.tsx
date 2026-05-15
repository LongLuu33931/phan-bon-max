import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPageCard } from "@/components/admin/login-page-card";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = Array.isArray(next) ? next[0] : next;

  if (supabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (user) redirect("/admin");
  }

  return <LoginPageCard nextPath={nextPath} />;
}
