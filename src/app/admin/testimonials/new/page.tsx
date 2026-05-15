import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getAllProductsForAdmin } from "@/lib/data";

export default async function NewTestimonialPage() {
  const products = await getAllProductsForAdmin();

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Feedback" title="Thêm feedback khách hàng" />
      <TestimonialForm products={products} />
    </AdminShell>
  );
}
