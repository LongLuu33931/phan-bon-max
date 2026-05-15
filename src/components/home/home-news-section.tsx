import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";

export function HomeNewsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="section py-14">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-semibold text-emerald-800">Tin tức</p>
          <h2 className="mt-2 text-3xl font-black text-stone-950">Cập nhật nông nghiệp</h2>
        </div>
        <Link href="/news" className="inline-flex min-h-11 items-center gap-2 font-semibold text-emerald-800">
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:-translate-y-1 hover:border-emerald-700 hover:shadow-xl"
          >
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
  );
}
