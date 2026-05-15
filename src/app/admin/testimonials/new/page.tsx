import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Feedback" title="Thêm feedback khách hàng" />
      <TestimonialForm />
    </AdminShell>
  );
}
