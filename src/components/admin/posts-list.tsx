import Link from "next/link";
import { Edit3 } from "lucide-react";
import type { Post } from "@/lib/types";

export function PostsList({ posts }: { posts: Post[] }) {
  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/admin/posts/${post.id}`}
          className="grid gap-3 border-b border-stone-100 p-5 transition hover:bg-stone-50 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <p className="font-black text-stone-950">{post.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-stone-600">{post.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
              <span className={post.status === "published" ? "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700" : "rounded-full bg-stone-100 px-3 py-1 text-stone-500"}>
                {post.status === "published" ? "Đã đăng" : "Bản nháp"}
              </span>
              {post.publishedAt ? <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{post.publishedAt}</span> : null}
            </div>
          </div>
          <span className="inline-flex h-9 w-fit items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-bold text-stone-700">
            <Edit3 size={15} /> Sửa
          </span>
        </Link>
      ))}
      {posts.length === 0 ? (
        <div className="p-6 text-sm font-semibold text-stone-500">Chưa có bài viết nào.</div>
      ) : null}
    </div>
  );
}
