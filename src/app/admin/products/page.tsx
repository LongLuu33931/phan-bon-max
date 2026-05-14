import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatCurrency } from "@/lib/format";
import { getAllProductsForAdmin, getCategories } from "@/lib/data";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProductsForAdmin(), getCategories()]);

  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-stone-950">Sản phẩm</h1>
        <Link href="/admin/products/new" className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-800 px-4 font-semibold text-white">
          <Plus size={18} /> Thêm sản phẩm
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="p-3">Tên sản phẩm</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-3 font-semibold text-stone-950">{product.name}</td>
                <td className="p-3">{categories.find((category) => category.id === product.categoryId)?.name}</td>
                <td className="p-3 font-semibold">{formatCurrency(product.price)}</td>
                <td className="p-3">{product.isActive ? "Đang hiển thị" : "Ẩn"}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="font-semibold text-emerald-800">Sửa</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
