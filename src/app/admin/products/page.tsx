import Link from "next/link";
import { Edit3, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatCurrency } from "@/lib/format";
import { getAllProductsForAdmin, getCategories } from "@/lib/data";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProductsForAdmin(), getCategories()]);

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Quản trị website</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Sản phẩm</h1>
        </div>
        <Link href="/admin/products/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 text-sm font-black text-white shadow-sm">
          <Plus size={18} /> Thêm sản phẩm
        </Link>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Tên sản phẩm</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-stone-50">
                  <td className="px-5 py-4">
                    <p className="font-black text-stone-950">{product.name}</p>
                    <p className="mt-1 text-xs font-semibold text-stone-500">SKU: {product.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{categories.find((category) => category.id === product.categoryId)?.name}</td>
                  <td className="px-5 py-4 font-black text-stone-950">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4">
                    <span className={product.isActive ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-500"}>
                      {product.isActive ? "Đang hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/products/${product.id}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-200 px-3 font-bold text-stone-700 hover:border-emerald-200 hover:text-emerald-800">
                      <Edit3 size={15} /> Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
