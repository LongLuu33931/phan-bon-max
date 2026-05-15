import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <AdminShell>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Feedback</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Thêm feedback khách hàng</h1>
      </div>
      <TestimonialForm />
    </AdminShell>
  );
}
