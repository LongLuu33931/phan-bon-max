import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
      <AdminPageHeader eyebrow="Sản phẩm" title="Sửa sản phẩm" />
      <ProductForm product={product} categories={categories} />
    </AdminShell>
  );
}
