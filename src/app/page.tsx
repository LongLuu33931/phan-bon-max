import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Truck,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ProductCard } from "@/components/product/product-card";
import { TestimonialStack } from "@/components/testimonial/testimonial-stack";
import { getCategories, getPosts, getProducts, getSettings, getTestimonials } from "@/lib/data";
import { PublicLayout } from "./(public-layout)";

export default async function Home() {
  const [products, categories, posts, settings, testimonials] = await Promise.all([
    getProducts(),
    getCategories(),
    getPosts(),
    getSettings(),
    getTestimonials(),
  ]);
  const featured = products.filter((product) => product.isFeatured).slice(0, 6);
  const heroProduct = products.find((product) => product.slug === "fruit-max-npk-8000") ?? featured[0] ?? products[0];
  const secondaryProduct = products.find((product) => product.slug === "cal-max-8000") ?? featured[1] ?? products[1];

  return (
    <PublicLayout>
      <section className="bg-emerald-900 text-white">
        <div className="section grid min-h-[620px] items-center gap-10 py-10 lg:grid-cols-[280px_1fr_420px]">
          <aside className="hidden overflow-hidden rounded-lg border border-white/15 bg-white/10 lg:block">
            <p className="border-b border-white/15 px-5 py-4 text-sm font-bold uppercase tracking-wide text-amber-200">
              Danh mục giải pháp
            </p>
            <div className="grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm font-semibold text-emerald-50 hover:bg-white/10"
                >
                  {category.name}
                  <ArrowRight size={15} />
                </Link>
              ))}
            </div>
            <div className="m-4 rounded-md bg-amber-300 p-4 text-emerald-950">
              <p className="text-sm font-black">Tư vấn nhanh theo tình trạng vườn</p>
              <a href={settings.zaloUrl} className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
                Gửi ảnh qua Zalo <ArrowRight size={16} />
              </a>
            </div>
          </aside>

          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold">
              <Leaf size={16} /> Dinh dưỡng theo từng giai đoạn cây trồng
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              MAX 8000 cho vườn khỏe, trái đẹp, năng suất bền
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Bộ sản phẩm phân bón theo từng nhu cầu: cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái nặng ký.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 font-semibold text-emerald-950"
              >
                Xem sản phẩm <ArrowRight size={18} />
              </Link>
              <a
                href={settings.zaloUrl}
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/50 px-5 font-semibold text-white"
              >
                Tư vấn qua Zalo
              </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[
                ["10+", "Dòng sản phẩm"],
                ["4", "Nhóm giải pháp"],
                ["24/7", "Hỗ trợ đại lý"],
                ["COD", "Đặt hàng nhanh"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-white/15 bg-white/10 p-3">
                  <p className="text-2xl font-black text-amber-200">{value}</p>
                  <p className="mt-1 text-emerald-50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px]">
            {heroProduct?.thumbnailUrl ? (
              <div className="absolute inset-x-8 top-4 overflow-hidden rounded-lg bg-white p-6 shadow-2xl">
                <Image
                  src={heroProduct.thumbnailUrl}
                  alt={heroProduct.name}
                  width={720}
                  height={720}
                  priority
                  className="aspect-square w-full object-contain"
                />
              </div>
            ) : null}
            {secondaryProduct?.thumbnailUrl ? (
              <div className="absolute bottom-0 left-0 w-40 overflow-hidden rounded-lg border-4 border-emerald-900 bg-white p-3 shadow-xl sm:w-52">
                <Image
                  src={secondaryProduct.thumbnailUrl}
                  alt={secondaryProduct.name}
                  width={420}
                  height={420}
                  className="aspect-square w-full object-contain"
                />
              </div>
            ) : null}
            <div className="absolute bottom-8 right-0 max-w-[220px] rounded-lg bg-amber-300 p-4 text-emerald-950 shadow-xl">
              <p className="text-sm font-black">Đúng dòng, đúng giai đoạn</p>
              <p className="mt-1 text-xs font-semibold">Dễ tư vấn cho đại lý và nhà vườn.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="section grid grid-cols-1 gap-4 py-5 md:grid-cols-4">
          {[
            { icon: Clock3, title: "Phục vụ nhanh", text: "Tư vấn chọn sản phẩm theo cây trồng" },
            { icon: ShieldCheck, title: "Thông tin rõ", text: "Công dụng, liều dùng, giai đoạn" },
            { icon: PackageCheck, title: "Đủ bộ MAX 8000", text: "Từ phục hồi đến nuôi trái" },
            { icon: Truck, title: "Giao hàng linh hoạt", text: "COD/Zalo cho nhà vườn và đại lý" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-md bg-stone-50 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-800 text-white">
                <item.icon size={20} />
              </span>
              <div>
                <p className="font-bold text-stone-950">{item.title}</p>
                <p className="text-sm text-stone-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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
              <Link href="/products" className="inline-flex items-center gap-2 font-semibold text-emerald-800">
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((product) => (
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

      <TestimonialStack testimonials={testimonials} />

      <section className="section py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-emerald-800">Tin tức</p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">Cập nhật nông nghiệp</h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 font-semibold text-emerald-800">
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>
        <div className="hidden">
          <h2 className="mt-4 text-2xl font-black">Cần tư vấn sản phẩm cho vườn?</h2>
          <p className="mt-3 leading-7 text-emerald-50">
            Gửi ảnh cây, loại cây và giai đoạn hiện tại qua Zalo để được gợi ý nhóm sản phẩm phù hợp.
          </p>
          <a href={settings.zaloUrl} className="mt-6 inline-flex rounded-md bg-white px-4 py-3 font-semibold text-emerald-950">
            Tư vấn qua Zalo
          </a>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl">
              <div className="relative aspect-[16/9] bg-emerald-50">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-emerald-900 text-sm font-black uppercase tracking-[0.14em] text-amber-200">
                    Tin tức
                  </div>
                )}
              </div>
              <div className="p-5">
              <p className="text-sm font-semibold text-emerald-800">Tin tức</p>
              <h3 className="mt-2 text-xl font-bold text-stone-950">{post.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="section">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="rounded-2xl bg-emerald-900 p-6 text-white">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-200">Liên hệ tư vấn</p>
              <h2 className="mt-3 text-3xl font-black leading-tight">Gửi thông tin vườn để được tư vấn đúng dòng MAX 8000</h2>
              <p className="mt-4 leading-7 text-emerald-50/85">
                Để lại số điện thoại, loại cây và tình trạng đang gặp. Đội ngũ MAX 8000 sẽ liên hệ lại để gợi ý sản phẩm phù hợp.
              </p>
              <div className="mt-5 grid gap-3 text-sm font-semibold text-emerald-50/90">
                <p>Hotline: {settings.hotline}</p>
                <p>Email: {settings.email}</p>
                <p>Zalo: tư vấn nhanh qua số điện thoại cửa hàng</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
