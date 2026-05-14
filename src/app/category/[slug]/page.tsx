import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
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
      <section className="section py-10">
        <h1 className="text-3xl font-black text-stone-950">{category.name}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-stone-600">{category.description}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} category={categories.find((item) => item.id === product.categoryId)} />
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
