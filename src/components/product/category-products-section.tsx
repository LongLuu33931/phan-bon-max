import { ProductCard } from "@/components/product/product-card";
import type { Category, Product } from "@/lib/types";

type CategoryProductsSectionProps = {
  categories: Category[];
  category: Category;
  products: Product[];
};

export function CategoryProductsSection({ categories, category, products }: CategoryProductsSectionProps) {
  return (
    <section className="section py-10">
      <h1 className="text-3xl font-black text-stone-950">{category.name}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-stone-600">{category.description}</p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            category={categories.find((item) => item.id === product.categoryId)}
            showCategory={false}
          />
        ))}
      </div>
    </section>
  );
}
