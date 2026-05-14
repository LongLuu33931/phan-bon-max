import { PublicLayout } from "../(public-layout)";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <PublicLayout>
      <section className="section max-w-xl py-12">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h1 className="text-2xl font-black text-stone-950">Đăng nhập CMS</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Dùng email/password của Supabase Auth để vào khu vực admin.
          </p>
          <LoginForm />
        </div>
      </section>
    </PublicLayout>
  );
}
