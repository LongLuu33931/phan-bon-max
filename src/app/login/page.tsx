import type { Metadata } from "next";
import { LoginPageCard } from "@/components/admin/login-page-card";

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

  return <LoginPageCard nextPath={nextPath} />;
}
