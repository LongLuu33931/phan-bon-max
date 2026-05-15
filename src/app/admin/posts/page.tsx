import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostsList } from "@/components/admin/posts-list";
import { getAllPostsForAdmin } from "@/lib/data";

export default async function AdminPostsPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Nội dung"
        title="Tin tức"
        action={(
          <Link href="/admin/posts/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 text-sm font-black text-white shadow-sm">
            <Plus size={18} /> Thêm bài viết
          </Link>
        )}
      />
      <PostsList posts={posts} />
    </AdminShell>
  );
}
