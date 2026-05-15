import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
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
      <section className="section py-10">
        <h1 className="text-3xl font-black text-stone-950">Sản phẩm MAX 8000</h1>
        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Lọc theo nhu cầu thực tế của vườn: cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a key={category.id} href={`#${category.slug}`} className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
              {category.name}
            </a>
          ))}
        </div>
      </section>
      <section className="section pb-14">
        {categories.map((category) => {
          const categoryProducts = products.filter((product) => product.categoryId === category.id);
          return (
            <div id={category.slug} key={category.id} className="border-t border-stone-200 py-10">
              <h2 className="text-2xl font-black text-stone-950">{category.name}</h2>
              <p className="mt-2 text-stone-600">{category.description}</p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} category={category} showCategory={false} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </PublicLayout>
  );
}
