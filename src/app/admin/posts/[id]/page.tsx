import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getAllPostsForAdmin } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const posts = await getAllPostsForAdmin();
  const post = posts.find((item) => item.id === id);
  if (!post) notFound();

  return (
    <AdminShell>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Tin tức</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Sửa bài viết</h1>
      </div>
      <PostForm post={post} />
    </AdminShell>
  );
}
