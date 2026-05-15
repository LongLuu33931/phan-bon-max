import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "@/components/product/product-detail-content";
import { getCategories, getProduct, getRelatedProducts, getSettings } from "@/lib/data";
import { PublicLayout } from "../../(public-layout)";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, categories, settings] = await Promise.all([
    getProduct(slug),
    getCategories(),
    getSettings(),
  ]);

  if (!product) notFound();

  const category = categories.find((item) => item.id === product.categoryId);
  const related = await getRelatedProducts(product);

  return (
    <PublicLayout>
      <ProductDetailContent
        categories={categories}
        category={category}
        product={product}
        related={related}
        settings={settings}
      />
    </PublicLayout>
  );
}
