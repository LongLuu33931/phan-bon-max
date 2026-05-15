"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Leaf, Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/lib/types";

const CART_KEY = "max8000-cart";
const CART_UPDATED_EVENT = "max8000-cart-updated";

function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const updateItems = () => setItems(getCartItems());
    const id = window.requestAnimationFrame(updateItems);

    window.addEventListener(CART_UPDATED_EVENT, updateItems);
    window.addEventListener("storage", updateItems);

    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener(CART_UPDATED_EVENT, updateItems);
      window.removeEventListener("storage", updateItems);
    };
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
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
          <div key={item.productId} className="grid gap-4 border-b border-stone-100 p-4 sm:grid-cols-[96px_1fr_auto]">
            <Link
              href={`/products/${item.slug}`}
              aria-label={item.name}
              className="relative h-24 w-24 overflow-hidden rounded-md border border-stone-100 bg-stone-50"
            >
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-emerald-700">
                  <Leaf size={28} />
                </span>
              )}
            </Link>
            <div className="min-w-0">
              <Link href={`/products/${item.slug}`} className="font-semibold text-stone-950 hover:text-emerald-800">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-stone-600">{formatCurrency(item.price)}</p>
              <p className="mt-2 text-sm font-bold text-amber-700">{formatCurrency(item.price * item.quantity)}</p>
            </div>
            <div className="flex items-center gap-3 sm:self-center">
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
