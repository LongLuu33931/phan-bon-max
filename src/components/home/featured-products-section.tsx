import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Category, Product } from "@/lib/types";

type FeaturedProductsSectionProps = {
  categories: Category[];
  products: Product[];
};

export function FeaturedProductsSection({ categories, products }: FeaturedProductsSectionProps) {
  return (
    <section className="section py-14">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit overflow-hidden rounded-lg border border-stone-200 bg-white">
          <p className="bg-emerald-900 px-5 py-4 font-bold uppercase tracking-wide text-white">Danh mục sản phẩm</p>
          <div className="grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center gap-3 border-b border-stone-100 px-5 py-4 font-semibold text-stone-800 hover:bg-amber-50"
              >
                <Sprout size={18} className="text-emerald-700" />
                {category.name}
              </Link>
            ))}
          </div>
        </aside>

        <div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-emerald-800">Sản phẩm nổi bật</p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">Bộ sản phẩm MAX 8000</h2>
            </div>
            <Link href="/products" className="inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-800">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find((category) => category.id === product.categoryId)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
