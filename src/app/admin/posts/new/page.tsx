import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <AdminShell>
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Tin tức</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">Thêm bài viết</h1>
      </div>
      <PostForm />
    </AdminShell>
  );
}
