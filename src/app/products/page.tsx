import type { Metadata } from "next";
import { ProductsPageContent } from "@/components/product/products-page-content";
import { getCategories, getProducts } from "@/lib/data";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh mục phân bón MAX 8000 theo từng giai đoạn cây trồng.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <PublicLayout>
      <ProductsPageContent products={products} categories={categories} />
    </PublicLayout>
  );
}
