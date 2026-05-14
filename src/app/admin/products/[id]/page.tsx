import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { getAllProductsForAdmin, getCategories } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [products, categories] = await Promise.all([getAllProductsForAdmin(), getCategories()]);
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <AdminShell>
      <h1 className="mb-6 text-3xl font-black text-stone-950">Sửa sản phẩm</h1>
      <ProductForm product={product} categories={categories} />
    </AdminShell>
  );
}
