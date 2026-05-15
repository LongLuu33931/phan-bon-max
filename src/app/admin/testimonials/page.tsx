import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialsTable } from "@/components/admin/testimonials-table";
import { getAllTestimonialsForAdmin } from "@/lib/data";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsForAdmin();

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Trải nghiệm khách hàng"
        title="Feedback khách hàng"
        action={(
          <Link href="/admin/testimonials/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 text-sm font-black text-white shadow-sm">
            <Plus size={18} /> Thêm feedback
          </Link>
        )}
      />
      <TestimonialsTable testimonials={testimonials} />
    </AdminShell>
  );
}
