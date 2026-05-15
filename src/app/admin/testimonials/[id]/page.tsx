import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
      <AdminPageHeader eyebrow="Feedback" title="Sửa feedback khách hàng" />
      <TestimonialForm testimonial={testimonial} />
    </AdminShell>
  );
}
