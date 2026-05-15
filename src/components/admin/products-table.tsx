"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Edit3 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { toggleProductActive } from "@/lib/actions";
import { formatCurrency } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

type ProductsTableProps = {
  categories: Category[];
  products: Product[];
};

export function ProductsTable({ categories, products }: ProductsTableProps) {
  const [rows, setRows] = useState(products);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle(product: Product) {
    const nextActive = !product.isActive;
    setPendingId(product.id);
    setRows((items) => items.map((item) => item.id === product.id ? { ...item, isActive: nextActive } : item));

    startTransition(async () => {
      const result = await toggleProductActive(product.id, nextActive);
      setPendingId(null);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
      if (!result.ok) {
        setRows((items) => items.map((item) => item.id === product.id ? { ...item, isActive: product.isActive } : item));
      }
    });
  }

  return (
    <div className="mt-7">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Tên sản phẩm</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Hiển thị</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((product) => (
                <tr key={product.id} className="transition hover:bg-stone-50">
                  <td className="px-5 py-4">
                    <p className="font-black text-stone-950">{product.name}</p>
                    <p className="mt-1 text-xs font-semibold text-stone-500">SKU: {product.sku}</p>
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {categories.find((category) => category.id === product.categoryId)?.name ?? "Chưa có danh mục"}
                  </td>
                  <td className="px-5 py-4 font-black text-stone-950">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      disabled={isPending && pendingId === product.id}
                      onClick={() => handleToggle(product)}
                      aria-pressed={product.isActive}
                      className={clsx(
                        "inline-flex h-8 w-14 items-center rounded-full p-1 transition disabled:cursor-wait disabled:opacity-60",
                        product.isActive ? "bg-emerald-600" : "bg-stone-300",
                      )}
                    >
                      <span
                        className={clsx(
                          "size-6 rounded-full bg-white shadow-sm transition",
                          product.isActive ? "translate-x-6" : "translate-x-0",
                        )}
                      />
                      <span className="sr-only">{product.isActive ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/products/${product.id}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-200 px-3 font-bold text-stone-700 hover:border-emerald-200 hover:text-emerald-800">
                      <Edit3 size={15} /> Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
