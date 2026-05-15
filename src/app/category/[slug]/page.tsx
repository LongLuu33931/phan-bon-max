import { notFound } from "next/navigation";
import { CategoryProductsSection } from "@/components/product/category-products-section";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/data";
import { PublicLayout } from "../../(public-layout)";

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
    getCategories(),
  ]);
  if (!category) notFound();

  return (
    <PublicLayout>
      <CategoryProductsSection category={category} products={products} categories={categories} />
    </PublicLayout>
  );
}
