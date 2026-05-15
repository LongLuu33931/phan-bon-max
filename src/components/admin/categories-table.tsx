"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useActionToast } from "@/hooks/use-action-toast";
import { deleteCategory, saveCategory, toggleCategoryActive, type ActionState } from "@/lib/actions";
import { slugify } from "@/lib/format";
import type { Category } from "@/lib/types";

type CategoriesTableProps = {
  categories: Category[];
  productCounts: Record<string, number>;
};

const initialState: ActionState = { ok: false, message: "" };
const inputClass = "h-11 rounded-xl border border-stone-200 bg-white px-3 text-sm font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const textareaClass = "rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const labelClass = "grid gap-2 text-sm font-bold text-stone-700";

export function CategoriesTable({ categories, productCounts }: CategoriesTableProps) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreateModal() {
    setEditingCategory(null);
    setIsModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setIsModalOpen(true);
  }

  function handleToggle(category: Category) {
    const nextActive = !category.isActive;
    setPendingId(category.id);

    startTransition(async () => {
      const result = await toggleCategoryActive(category.id, nextActive);
      setPendingId(null);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  function handleDelete(category: Category) {
    const productCount = productCounts[category.id] ?? 0;
    if (productCount > 0) {
      toast.error(`Không thể xóa vì đang có ${productCount} sản phẩm dùng danh mục này.`);
      return;
    }

    if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;

    setPendingId(category.id);
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      setPendingId(null);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-7">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span />
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 text-sm font-black text-white shadow-sm"
        >
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Sản phẩm</th>
                <th className="px-5 py-4">Thứ tự</th>
                <th className="px-5 py-4">Hiển thị</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((category) => {
                const productCount = productCounts[category.id] ?? 0;

                return (
                  <tr key={category.id} className="transition hover:bg-stone-50">
                    <td className="px-5 py-4">
                      <p className="font-black text-stone-950">{category.name}</p>
                      <p className="mt-1 line-clamp-1 text-xs font-semibold text-stone-500">{category.description || "Chưa có mô tả"}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-600">{category.slug}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-600">
                        {productCount} sản phẩm
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-stone-950">{category.sortOrder}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={isPending && pendingId === category.id}
                        onClick={() => handleToggle(category)}
                        aria-pressed={category.isActive}
                        className={clsx(
                          "inline-flex h-8 w-14 items-center rounded-full p-1 transition disabled:cursor-wait disabled:opacity-60",
                          category.isActive ? "bg-emerald-600" : "bg-stone-300",
                        )}
                      >
                        <span
                          className={clsx(
                            "size-6 rounded-full bg-white shadow-sm transition",
                            category.isActive ? "translate-x-6" : "translate-x-0",
                          )}
                        />
                        <span className="sr-only">{category.isActive ? "Ẩn danh mục" : "Hiển thị danh mục"}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-200 px-3 font-bold text-stone-700 hover:border-emerald-200 hover:text-emerald-800"
                        >
                          <Edit3 size={15} /> Sửa
                        </button>
                        <button
                          type="button"
                          disabled={isPending && pendingId === category.id}
                          onClick={() => handleDelete(category)}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 font-bold text-red-700 disabled:cursor-wait disabled:opacity-60"
                        >
                          <Trash2 size={15} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [state, action, isPending] = useActionState(saveCategory, initialState);
  const handledSuccessRef = useRef(false);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? slugify(category?.name ?? ""));
  const resolvedSlug = slug || slugify(name);
  useActionToast(state);

  useEffect(() => {
    if (state.ok && !handledSuccessRef.current) {
      handledSuccessRef.current = true;
      onSaved(state.message);
    }
  }, [onSaved, state]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/45 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
              {category ? "Cập nhật danh mục" : "Danh mục mới"}
            </p>
            <h2 className="mt-1 text-xl font-black text-stone-950">
              {category ? category.name : "Thêm danh mục sản phẩm"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50">
            <X size={18} />
            <span className="sr-only">Đóng</span>
          </button>
        </div>

        <form key={category?.id ?? "new"} action={action} className="grid gap-5 p-6">
          {category ? <input type="hidden" name="id" value={category.id} /> : null}
          <input type="hidden" name="slug" value={resolvedSlug} />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>
              Tên danh mục
              <input
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setSlug(slugify(event.target.value));
                }}
                required
                className={inputClass}
              />
            </label>
            <div className={labelClass}>
              Slug tu dong
              <div className="flex h-11 min-w-0 items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-normal text-stone-500">
                <span className="truncate">{resolvedSlug || "slug-se-tu-tao-theo-ten-danh-muc"}</span>
              </div>
            </div>
            <label className={labelClass}>
              Thứ tự
              <input name="sortOrder" type="number" min={0} defaultValue={category?.sortOrder ?? 0} className={inputClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Mô tả
              <textarea name="description" rows={3} defaultValue={category?.description} className={textareaClass} />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-bold text-stone-700 sm:col-span-2">
              <input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} value="true" className="size-4 accent-emerald-800" />
              Hiển thị danh mục ngoài website
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
            <button type="button" onClick={onClose} className="h-11 rounded-xl border border-stone-200 px-4 text-sm font-black text-stone-700 hover:bg-stone-50">
              Hủy
            </button>
            <button disabled={isPending} className="h-11 rounded-xl bg-emerald-900 px-4 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-stone-300">
              {isPending ? "Đang lưu..." : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
