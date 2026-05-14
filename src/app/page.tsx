import Link from "next/link";
import { ArrowRight, CheckCircle2, Leaf, PackageCheck, Sprout } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { getCategories, getPosts, getProducts, getSettings } from "@/lib/data";
import { PublicLayout } from "./(public-layout)";

export default async function Home() {
  const [products, categories, posts, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getPosts(),
    getSettings(),
  ]);
  const featured = products.filter((product) => product.isFeatured).slice(0, 6);

  return (
    <PublicLayout>
      <section className="bg-[linear-gradient(115deg,#153d2e_0%,#285b38_48%,#dba840_100%)] text-white">
        <div className="section grid min-h-[560px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold">
              <Leaf size={16} /> Dinh dưỡng theo từng giai đoạn cây trồng
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              MAX 8000
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Hệ sản phẩm giúp nhà vườn cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái nặng ký.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 font-semibold text-emerald-950">
                Xem sản phẩm <ArrowRight size={18} />
              </Link>
              <a href={settings.zaloUrl} className="inline-flex h-12 items-center justify-center rounded-md border border-white/50 px-5 font-semibold text-white">
                Tư vấn qua Zalo
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/12 p-5 shadow-2xl backdrop-blur">
            <div className="grid gap-3">
              {["Đất chai cứng, rễ yếu", "Cây vàng lá, chậm lớn", "Ra hoa kém, rụng trái non", "Trái nhỏ, kém bóng, nhẹ ký"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white p-4 text-emerald-950">
                  <CheckCircle2 className="text-emerald-700" size={20} />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-emerald-800">Danh mục giải pháp</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Chọn đúng theo giai đoạn cây</h2>
          </div>
          <Link href="/products" className="font-semibold text-emerald-800">Xem tất cả</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="rounded-lg border border-stone-200 bg-white p-5 hover:border-emerald-700">
              <Sprout className="text-emerald-800" />
              <h3 className="mt-4 font-bold text-stone-950">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="section">
          <div>
            <p className="font-semibold text-emerald-800">Sản phẩm nổi bật</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Bộ sản phẩm MAX 8000</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find((category) => category.id === product.categoryId)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section grid gap-6 py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg bg-emerald-900 p-6 text-white">
          <PackageCheck size={32} />
          <h2 className="mt-4 text-2xl font-black">CMS sẵn sàng vận hành</h2>
          <p className="mt-3 leading-7 text-emerald-50">
            Admin có thể quản lý sản phẩm, thumbnail, công dụng, bảng hướng dẫn, tin tức và đơn hàng sau khi cấu hình Supabase.
          </p>
          <Link href="/admin" className="mt-6 inline-flex rounded-md bg-white px-4 py-3 font-semibold text-emerald-950">
            Vào CMS
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="rounded-lg border border-stone-200 bg-white p-5">
              <p className="text-sm font-semibold text-emerald-800">Tin tức</p>
              <h3 className="mt-2 text-xl font-bold text-stone-950">{post.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
