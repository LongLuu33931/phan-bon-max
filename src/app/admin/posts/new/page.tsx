import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <AdminShell>
      <AdminPageHeader eyebrow="Tin tức" title="Thêm bài viết" />
      <PostForm />
    </AdminShell>
  );
}
