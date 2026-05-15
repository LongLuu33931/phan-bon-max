import Link from "next/link";
import { Phone } from "lucide-react";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { formatCurrency } from "@/lib/format";
import type { Category, Product, SiteSettings } from "@/lib/types";

type ProductDetailContentProps = {
  categories: Category[];
  category?: Category;
  product: Product;
  related: Product[];
  settings: SiteSettings;
};

export function ProductDetailContent({ categories, category, product, related, settings }: ProductDetailContentProps) {
  return (
    <>
      <section className="section py-10">
        <div className="flex flex-wrap items-center gap-x-1 text-sm text-stone-500">
          <Link href="/" className="inline-flex min-h-11 items-center">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="inline-flex min-h-11 items-center">Sản phẩm</Link>
          <span>/</span>
          <span>{category?.name}</span>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductGallery product={product} />
          <div className="min-w-0 lg:pt-10">
            <p className="font-semibold text-emerald-800">{category?.name}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-stone-950 lg:text-4xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-black text-amber-700">{formatCurrency(product.price)}</p>
            <div className="mt-4 grid gap-2 text-sm text-stone-700">
              <p><strong>Mã sản phẩm:</strong> {product.sku}</p>
              <p><strong>Xuất xứ:</strong> {product.origin}</p>
              <p><strong>Hạn sử dụng:</strong> {product.shelfLife}</p>
            </div>
            <p className="mt-5 leading-8 text-stone-700">{product.shortDescription}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToCart product={product} />
              <a href={`tel:${settings.hotline.replace(/\s/g, "")}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-stone-300 px-5 font-semibold text-stone-800">
                <Phone size={18} /> Gọi tư vấn
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProductInformation product={product} />
      <RelatedProducts products={related} categories={categories} />
    </>
  );
}

function ProductInformation({ product }: { product: Product }) {
  return (
    <section className="bg-white py-12">
      <div className="section grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="h-fit rounded-lg border border-stone-200 p-5">
          <h2 className="text-xl font-black text-stone-950">Thông tin sản phẩm</h2>
          <div className="mt-4 divide-y divide-stone-100">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid gap-1 py-3 text-sm">
                <span className="font-semibold text-stone-500">{spec.label}</span>
                <span className="text-stone-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </aside>
        <div className="min-w-0">
          <h2 className="text-2xl font-black text-stone-950">Mô tả</h2>
          <p className="mt-3 leading-8 text-stone-700">{product.description}</p>

          <h2 className="mt-10 text-2xl font-black text-stone-950">Công dụng nổi bật</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {product.benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
                <h3 className="font-bold text-emerald-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-700">{benefit.description}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-black text-stone-950">Hướng dẫn sử dụng</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-stone-200">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-emerald-900 text-white">
                <tr>
                  <th className="p-3">Đối tượng cây trồng</th>
                  <th className="p-3">Liều lượng & quy đổi</th>
                  <th className="p-3">Thời điểm & cách dùng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {product.usageRows.map((row) => (
                  <tr key={row.crop}>
                    <td className="p-3 font-semibold">{row.crop}</td>
                    <td className="p-3">{row.dosage}</td>
                    <td className="p-3">{row.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-2xl font-black text-stone-950">Vì sao nên chọn?</h2>
          <ul className="mt-4 grid gap-3">
            {product.reasons.map((reason) => (
              <li key={reason} className="rounded-md bg-amber-50 p-4 text-sm font-medium text-stone-800">{reason}</li>
            ))}
          </ul>
          {product.note ? <p className="mt-5 text-sm font-semibold text-stone-600">{product.note}</p> : null}
        </div>
      </div>
    </section>
  );
}

function RelatedProducts({ products, categories }: { products: Product[]; categories: Category[] }) {
  if (!products.length) return null;

  return (
    <section className="section py-12">
      <h2 className="text-2xl font-black text-stone-950">Sản phẩm tương tự</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} category={categories.find((categoryItem) => categoryItem.id === item.categoryId)} />
        ))}
      </div>
    </section>
  );
}
