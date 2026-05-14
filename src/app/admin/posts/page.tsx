import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPosts } from "@/lib/data";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <AdminShell>
      <h1 className="text-3xl font-black text-stone-950">Tin tức</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/${post.slug}`} className="block border-b border-stone-100 p-4">
            <p className="font-semibold text-stone-950">{post.title}</p>
            <p className="mt-1 text-sm text-stone-600">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
