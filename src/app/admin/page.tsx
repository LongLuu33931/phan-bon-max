import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAllProductsForAdmin, getAllTestimonialsForAdmin, getContactMessagesForAdmin, getOrdersForAdmin, getPosts } from "@/lib/data";

export default async function AdminPage() {
  const [products, posts, testimonials, orders, contacts] = await Promise.all([
    getAllProductsForAdmin(),
    getPosts(),
    getAllTestimonialsForAdmin(),
    getOrdersForAdmin(),
    getContactMessagesForAdmin(),
  ]);

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Tổng quan" title="Dashboard" />
      <AdminDashboard
        products={products}
        posts={posts}
        testimonials={testimonials}
        orders={orders}
        contacts={contacts}
      />
    </AdminShell>
  );
}
