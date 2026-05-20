"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { togglePostPublished } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostsList({ posts }: { posts: Post[] }) {
    const [rows, setRows] = useState(posts);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleToggle(post: Post) {
        const nextPublished = post.status !== "published";
        const nextStatus = nextPublished ? "published" : "draft";
        const nextPublishedAt = nextPublished
            ? post.publishedAt || new Date().toISOString()
            : "";

        setPendingId(post.id);
        setRows((items) =>
            items.map((item) =>
                item.id === post.id
                    ? {
                          ...item,
                          status: nextStatus,
                          publishedAt: nextPublishedAt,
                      }
                    : item,
            ),
        );

        startTransition(async () => {
            const result = await togglePostPublished(post.id, nextPublished);
            setPendingId(null);

            if (result.ok) {
                toast.success(result.message);
                return;
            }

            toast.error(result.message);
            setRows((items) =>
                items.map((item) => (item.id === post.id ? post : item)),
            );
        });
    }

    return (
        <div className="mt-7 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
                        <tr>
                            <th className="px-5 py-4">Bài viết</th>
                            <th className="px-5 py-4">Loại</th>
                            <th className="px-5 py-4">Ngày đăng</th>
                            <th className="px-5 py-4">Trạng thái</th>
                            <th className="px-5 py-4">Hiển thị</th>
                            <th className="px-5 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {rows.map((post) => {
                            const isPublished = post.status === "published";

                            return (
                                <tr
                                    key={post.id}
                                    className="align-middle transition hover:bg-stone-50"
                                >
                                    <td className="max-w-3xl px-5 py-4">
                                        <p className="line-clamp-1 font-black text-stone-950">
                                            {post.title}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">
                                            {post.excerpt}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={
                                                post.postType === "press"
                                                    ? "rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"
                                                    : "rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-600"
                                            }
                                        >
                                            {post.postType === "press"
                                                ? "Báo chí"
                                                : "Bài viết"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-amber-700">
                                        {post.publishedAt
                                            ? formatDate(post.publishedAt)
                                            : "Chưa đặt"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={
                                                isPublished
                                                    ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
                                                    : "rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-500"
                                            }
                                        >
                                            {isPublished
                                                ? "Đã đăng"
                                                : "Bản nháp"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            type="button"
                                            disabled={
                                                isPending &&
                                                pendingId === post.id
                                            }
                                            onClick={() => handleToggle(post)}
                                            aria-pressed={isPublished}
                                            className={clsx(
                                                "inline-flex h-8 w-14 items-center rounded-full p-1 transition disabled:cursor-wait disabled:opacity-60",
                                                isPublished
                                                    ? "bg-emerald-600"
                                                    : "bg-stone-300",
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    "size-6 rounded-full bg-white shadow-sm transition",
                                                    isPublished
                                                        ? "translate-x-6"
                                                        : "translate-x-0",
                                                )}
                                            />
                                            <span className="sr-only">
                                                {isPublished
                                                    ? "Ẩn bài viết"
                                                    : "Hiển thị bài viết"}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <Link
                                            href={`/admin/posts/${post.id}`}
                                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-200 px-3 font-bold text-stone-700 hover:border-emerald-200 hover:text-emerald-800"
                                        >
                                            <Edit3 size={15} /> Sửa
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {rows.length === 0 ? (
                <div className="p-6 text-sm font-semibold text-stone-500">
                    Chưa có bài viết nào.
                </div>
            ) : null}
        </div>
    );
}
