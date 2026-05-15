import { Package, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrderDetailDialog } from "@/components/admin/order-detail-dialog";
import { formatCurrency } from "@/lib/format";
import { getOrdersForAdmin } from "@/lib/data";
import type { Order } from "@/lib/types";

const statusLabels: Record<Order["status"], string> = {
  new: "Mới",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Đã giao hàng",
  cancelled: "Hủy",
};

const statusStyles: Record<Order["status"], string> = {
  new: "bg-orange-50 text-orange-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipping: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-stone-100 text-stone-600",
};

function getOrderProductSummary(order: Order) {
  const firstItem = order.items[0]?.productName;
  if (!firstItem) return "Chưa có sản phẩm";
  if (order.items.length === 1) return firstItem;
  return `${firstItem} và ${order.items.length - 1} sản phẩm khác`;
}

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAdmin();
  const newOrderCount = orders.filter((order) => order.status === "new").length;

  return (
    <AdminShell>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Bán hàng</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Đơn hàng</h1>
        </div>
        {newOrderCount > 0 ? (
          <span className="h-fit rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
            {newOrderCount} đơn mới cần xử lý
          </span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        {orders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
                <tr>
                  <th className="px-5 py-4">Mã đơn</th>
                  <th className="px-5 py-4">Khách hàng</th>
                  <th className="px-5 py-4">Sản phẩm</th>
                  <th className="px-5 py-4">Tổng tiền</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4">Ngày tạo</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="align-middle transition hover:bg-stone-50">
                    <td className="px-5 py-4 font-black text-stone-950">{order.orderCode}</td>
                    <td className="px-5 py-4">
                      <p className="font-black text-stone-950">{order.customerName}</p>
                      <a href={`tel:${order.phone.replace(/\s/g, "")}`} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                        <Phone size={13} /> {order.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-96 items-start gap-2 text-xs">
                        <Package size={14} className="mt-0.5 shrink-0 text-emerald-700" />
                        <div>
                          <p className="line-clamp-1 font-bold text-stone-800">{getOrderProductSummary(order)}</p>
                          <p className="mt-1 text-stone-500">{order.items.length} sản phẩm trong đơn</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-black text-stone-950">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-stone-500">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <OrderDetailDialog order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-sm font-semibold text-stone-600">Chưa có đơn hàng nào trong hệ thống.</div>
        )}
      </div>
    </AdminShell>
  );
}
