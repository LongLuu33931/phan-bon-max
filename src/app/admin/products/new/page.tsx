import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Sản phẩm" title="Thêm sản phẩm" />
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
