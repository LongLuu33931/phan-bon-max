import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersTable } from "@/components/admin/orders-table";
import { getOrdersForAdmin } from "@/lib/data";

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin();
  const newOrderCount = orders.filter((order) => order.status === "new").length;

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Bán hàng"
        title="Đơn hàng"
        badge={newOrderCount > 0 ? (
          <span className="h-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
            {newOrderCount} đơn mới cần xử lý
          </span>
        ) : null}
      />
      <OrdersTable orders={orders} />
    </AdminShell>
  );
}
