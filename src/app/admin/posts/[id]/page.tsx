import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
      <AdminPageHeader eyebrow="Tin tức" title="Sửa bài viết" />
      <PostForm post={post} />
    </AdminShell>
  );
}
