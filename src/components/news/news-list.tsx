import Link from "next/link";
import type { Post } from "@/lib/types";

export function NewsList({ posts }: { posts: Post[] }) {
  return (
    <section className="section py-10">
      <h1 className="text-3xl font-black text-stone-950">Tin tức nông nghiệp</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/${post.slug}`} className="rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-sm font-semibold text-emerald-800">{post.publishedAt}</p>
            <h2 className="mt-2 text-xl font-bold text-stone-950">{post.title}</h2>
            <p className="mt-3 leading-7 text-stone-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
