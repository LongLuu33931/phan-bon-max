import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function NewsList({ posts }: { posts: Post[] }) {
  return (
    <section className="section py-10">
      <h1 className="text-3xl font-black text-stone-950">Tin tức nông nghiệp</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
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
            <div className="p-6">
              <p className="text-sm font-semibold text-emerald-800">{formatDate(post.publishedAt)}</p>
              <h2 className="mt-2 text-xl font-bold text-stone-950">{post.title}</h2>
              <p className="mt-3 leading-7 text-stone-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
