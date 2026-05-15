import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { CategoriesTable } from "@/components/admin/categories-table";
import { getAllCategoriesForAdmin, getAllProductsForAdmin } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([getAllCategoriesForAdmin(), getAllProductsForAdmin()]);
  const productCounts = products.reduce<Record<string, number>>((counts, product) => {
    counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Quản trị website" title="Danh mục sản phẩm" />
      <CategoriesTable categories={categories} productCounts={productCounts} />
    </AdminShell>
  );
}
