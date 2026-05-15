import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Sản phẩm</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Thêm sản phẩm</h1>
      </div>
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
