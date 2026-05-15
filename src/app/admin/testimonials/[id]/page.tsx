import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getAllTestimonialsForAdmin } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const testimonials = await getAllTestimonialsForAdmin();
  const testimonial = testimonials.find((item) => item.id === id);
  if (!testimonial) notFound();

  return (
    <AdminShell>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Feedback</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Sửa feedback khách hàng</h1>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </AdminShell>
  );
}
