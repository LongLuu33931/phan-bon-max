import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductsTable } from "@/components/admin/products-table";
import { getAllCategoriesForAdmin, getAllProductsForAdmin } from "@/lib/data";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProductsForAdmin(), getAllCategoriesForAdmin()]);

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Quản trị website"
        title="Sản phẩm"
        action={(
          <Link href="/admin/products/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 text-sm font-black text-white shadow-sm">
            <Plus size={18} /> Thêm sản phẩm
          </Link>
        )}
      />
      <ProductsTable products={products} categories={categories} />
    </AdminShell>
  );
}
