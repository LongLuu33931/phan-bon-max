import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-stone-950">Đơn hàng</h1>
      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
        <p className="font-semibold text-stone-900">Bảng đơn hàng đã sẵn sàng cho Supabase.</p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Sau khi cấu hình env và chạy schema, các đơn từ checkout sẽ lưu vào `orders` và `order_items`.
          Bước tiếp theo có thể thêm filter trạng thái, đổi trạng thái và xuất CSV.
        </p>
      </div>
    </AdminShell>
  );
}
