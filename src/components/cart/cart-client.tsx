"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/lib/types";

const CART_KEY = "max8000-cart";

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setItems(JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  if (!items.length) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-stone-950">Giỏ hàng đang trống</h1>
        <p className="mt-2 text-stone-600">Anh có thể chọn sản phẩm theo từng giai đoạn cây trồng.</p>
        <Link className="mt-6 inline-flex rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white" href="/products">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-stone-200 bg-white">
        {items.map((item) => (
          <div key={item.productId} className="grid gap-4 border-b border-stone-100 p-4 sm:grid-cols-[1fr_auto]">
            <div>
              <Link href={`/products/${item.slug}`} className="font-semibold text-stone-950 hover:text-emerald-800">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-stone-600">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200"
                onClick={() =>
                  persist(
                    items.map((entry) =>
                      entry.productId === item.productId
                        ? { ...entry, quantity: Math.max(1, entry.quantity - 1) }
                        : entry,
                    ),
                  )
                }
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200"
                onClick={() =>
                  persist(
                    items.map((entry) =>
                      entry.productId === item.productId ? { ...entry, quantity: entry.quantity + 1 } : entry,
                    ),
                  )
                }
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-700"
                onClick={() => persist(items.filter((entry) => entry.productId !== item.productId))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5">
        <p className="text-lg font-bold text-stone-950">Tổng giỏ hàng</p>
        <div className="mt-4 flex justify-between border-t border-stone-100 pt-4">
          <span>Tạm tính</span>
          <span className="font-bold text-amber-700">{formatCurrency(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-5 flex h-12 items-center justify-center rounded-md bg-emerald-800 font-semibold text-white"
        >
          Tiến hành đặt hàng
        </Link>
      </aside>
    </div>
  );
}
