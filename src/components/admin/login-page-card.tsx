import { LoginForm } from "@/components/admin/login-form";

type LoginPageCardProps = {
  nextPath?: string;
};

export function LoginPageCard({ nextPath }: LoginPageCardProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
        <h1 className="text-2xl font-black text-stone-950">Đăng nhập</h1>
        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
