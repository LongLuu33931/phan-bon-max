import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <h1 className="mb-6 text-3xl font-black text-stone-950">Thêm sản phẩm</h1>
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
