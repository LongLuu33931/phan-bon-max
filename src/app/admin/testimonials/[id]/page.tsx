import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getAllProductsForAdmin, getAllTestimonialsForAdmin } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const [testimonials, products] = await Promise.all([
    getAllTestimonialsForAdmin(),
    getAllProductsForAdmin(),
  ]);
  const testimonial = testimonials.find((item) => item.id === id);
  if (!testimonial) notFound();

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Feedback" title="Sửa feedback khách hàng" />
      <TestimonialForm testimonial={testimonial} products={products} />
    </AdminShell>
  );
}
