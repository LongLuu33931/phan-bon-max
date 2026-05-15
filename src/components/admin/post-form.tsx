"use client";

import { useActionState, useState } from "react";
import { Bold, Eye, Heading2, ImagePlus, Italic, Link as LinkIcon, List, ListOrdered, Quote, Save, UploadCloud } from "lucide-react";
import { AdminFormActions } from "@/components/admin/form-actions";
import { MarkdownContent } from "@/components/markdown-content";
import { savePost, uploadPostImage, type ActionState } from "@/lib/actions";
import type { Post } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-12 rounded-xl border border-stone-200 bg-white px-4 font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "h-full w-full resize-none rounded-none border-0 bg-white px-4 py-3 font-mono text-sm font-normal leading-7 text-stone-900 outline-none";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";
const inlineImageInputId = "post-inline-image-upload";

const markdownTools = [
  { label: "Tiêu đề", icon: Heading2, before: "## ", after: "", placeholder: "Tiêu đề phụ" },
  { label: "Đậm", icon: Bold, before: "**", after: "**", placeholder: "nội dung" },
  { label: "Nghiêng", icon: Italic, before: "_", after: "_", placeholder: "nội dung" },
  { label: "Danh sách", icon: List, before: "- ", after: "", placeholder: "Ý chính", mode: "line" },
  { label: "Danh sách số", icon: ListOrdered, before: "1. ", after: "", placeholder: "Bước thực hiện", mode: "ordered" },
  { label: "Trích dẫn", icon: Quote, before: "> ", after: "", placeholder: "Ghi chú", mode: "line" },
  { label: "Link", icon: LinkIcon, before: "[", after: "](https://example.com)", placeholder: "Tên link" },
];

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function makeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatSelectedLines(value: string, prefix: string, mode: "line" | "ordered") {
  let order = 1;

  return value
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line;

      const cleanLine = line.replace(/^\s*(?:[-*+]\s+|\d+\.\s+|>\s*)/, "");
      if (mode === "ordered") {
        return `${order++}. ${cleanLine}`;
      }

      return `${prefix}${cleanLine}`;
    })
    .join("\n");
}

export function PostForm({ post }: { post?: Post }) {
  const [state, action, isPending] = useActionState(savePost, initialState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? makeSlug(post?.title ?? ""));
  const [content, setContent] = useState(post?.content ?? "");
  const [coverPreview, setCoverPreview] = useState(post?.coverImageUrl ?? "");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const resolvedSlug = slug || makeSlug(title);

  function insertMarkdown(before: string, after = "", placeholder = "nội dung", mode?: "line" | "ordered") {
    const textarea = document.querySelector<HTMLTextAreaElement>("textarea[name='content']");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const formatted = mode ? formatSelectedLines(selected, before, mode) : `${before}${selected}${after}`;
    const next = `${content.slice(0, start)}${formatted}${content.slice(end)}`;
    setContent(next);

    requestAnimationFrame(() => {
      textarea.focus();
      if (mode) {
        textarea.setSelectionRange(start, start + formatted.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      }
    });
  }

  async function uploadInlineImage(file: File) {
    setUploadMessage("Đang upload hình ảnh...");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("image", file);
      formData.set("folder", resolvedSlug || title || "post");

      const result = await uploadPostImage(formData);
      if (!result.ok || !result.url) {
        setUploadMessage(result.message);
        return;
      }

      const alt = file.name.replace(/\.[^.]+$/, "") || "Hình ảnh bài viết";
      insertMarkdown("![", `](${result.url})`, alt);
      setUploadMessage("Đã upload và chèn hình ảnh vào bài viết.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={action} className="grid gap-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="slug" value={resolvedSlug} />
      <input type="hidden" name="coverImageUrl" value={coverPreview} />

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Thông tin bài viết</h2>
          <p className="mt-1 text-sm text-stone-500">Tiêu đề, slug tự động, ảnh bìa và mô tả ngắn dùng cho danh sách tin tức.</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className={`${labelClass} lg:col-span-2`}>
            Tiêu đề
            <input
              name="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setSlug(makeSlug(event.target.value));
              }}
              required
              className={inputClass}
            />
          </label>
          <div className="grid gap-2 text-sm font-bold text-stone-700">
            Slug tự động
            <div className="flex h-12 min-w-0 items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50 px-4 font-normal text-stone-500">
              <span className="truncate">{resolvedSlug || "slug-se-tu-tao-theo-tieu-de"}</span>
            </div>
          </div>
          <label className={labelClass}>
            Trạng thái
            <select name="status" defaultValue={post?.status ?? "draft"} className={inputClass}>
              <option value="draft">Bản nháp</option>
              <option value="published">Đăng công khai</option>
            </select>
          </label>
          <label className={labelClass}>
            Ngày đăng
            <input name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocal(post?.publishedAt)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Upload ảnh bìa
            <input
              name="coverImage"
              type="file"
              accept="image/*"
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-900 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setCoverPreview(URL.createObjectURL(file));
              }}
            />
          </label>
          <label className={`${labelClass} lg:col-span-2`}>
            Mô tả ngắn
            <textarea name="excerpt" rows={3} defaultValue={post?.excerpt} required className="min-h-[120px] rounded-xl border border-stone-200 bg-white px-4 py-3 text-base font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          </label>
          {coverPreview ? (
            <div className="lg:col-span-2">
              <p className="mb-2 text-sm font-bold text-stone-700">Ảnh bìa hiện tại</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverPreview} alt="Ảnh bìa bài viết" className="h-56 w-full rounded-xl border border-stone-200 object-cover" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-stone-100 pb-5">
          <h2 className="text-lg font-black text-stone-950">Nội dung Markdown</h2>
          <p className="mt-1 text-sm text-stone-500">Nút hình ảnh sẽ upload lên Supabase rồi chèn vào bài viết.</p>
        </div>
        {uploadMessage ? (
          <p className={uploadMessage.startsWith("Đã") ? "mt-3 text-sm font-bold text-emerald-700" : "mt-3 text-sm font-bold text-amber-700"}>
            {uploadMessage}
          </p>
        ) : null}
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-2">
              <span className="text-sm font-bold text-stone-700">Soạn thảo</span>
              <div className="flex flex-wrap gap-2">
                {markdownTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={() => insertMarkdown(tool.before, tool.after, tool.placeholder, tool.mode as "line" | "ordered" | undefined)}
                      title={tool.label}
                      className="inline-grid size-9 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => document.getElementById(inlineImageInputId)?.click()}
                  title="Upload hình ảnh"
                  disabled={isUploading}
                  className="inline-grid size-9 place-items-center rounded-lg border border-stone-200 bg-white text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50"
                >
                  <ImagePlus size={16} />
                </button>
                <input
                  id={inlineImageInputId}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void uploadInlineImage(file);
                  }}
                />
              </div>
            </div>
            <div className="h-[62vh] min-h-[460px] max-h-[760px] focus-within:ring-4 focus-within:ring-emerald-100">
              <textarea
                name="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                className={textareaClass}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            <div className="flex min-h-14 items-center border-b border-stone-200 bg-stone-50 px-4 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-stone-700">
                <Eye size={16} /> Xem trước
              </span>
            </div>
            <div className="h-[62vh] min-h-[460px] max-h-[760px] overflow-y-auto px-5 py-4">
              {content.trim() ? (
                <MarkdownContent content={content} />
              ) : (
                <p className="text-sm font-semibold text-stone-400">Nội dung xem trước sẽ hiển thị ở đây.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <h2 className="text-lg font-black text-stone-950">SEO</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className={labelClass}>
            SEO title
            <input name="seoTitle" defaultValue={post?.title} className={inputClass} />
          </label>
          <label className={labelClass}>
            SEO description
            <input name="seoDescription" defaultValue={post?.excerpt} className={inputClass} />
          </label>
        </div>
      </section>

      <AdminFormActions message={state.message} ok={state.ok}>
        <button disabled={isPending} className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-900 px-5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-stone-300">
          {isPending ? <UploadCloud size={17} /> : <Save size={17} />} {isPending ? "Đang lưu..." : "Lưu bài viết"}
        </button>
      </AdminFormActions>
    </form>
  );
}
