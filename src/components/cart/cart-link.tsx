"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Leaf, ShoppingCart, Trash2 } from "lucide-react";
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

export function CartLink() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const updateItems = () => setItems(getCartItems());

    updateItems();
    window.addEventListener(CART_UPDATED_EVENT, updateItems);
    window.addEventListener("storage", updateItems);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateItems);
      window.removeEventListener("storage", updateItems);
    };
  }, []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0),
    [items],
  );
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  function persistCart(nextItems: CartItem[]) {
    setItems(nextItems);
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }

  function removeItem(productId: string) {
    persistCart(items.filter((item) => item.productId !== productId));
  }

  return (
    <div className="group relative">
      <Link
        href="/cart"
        aria-label={count > 0 ? `Giỏ hàng có ${count} sản phẩm` : "Giỏ hàng"}
        className="relative flex h-11 w-11 items-center justify-center rounded-md border border-stone-200 text-stone-700 hover:border-emerald-700 hover:text-emerald-800"
      >
        <ShoppingCart size={19} />
        {count > 0 ? (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </Link>

      <div className="invisible absolute right-0 top-full z-50 hidden w-[min(22rem,calc(100vw-2rem))] pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 md:block">
        <div className="rounded-md border border-stone-200 bg-white p-4 text-stone-800 shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <p className="font-bold text-stone-950">Giỏ hàng</p>
            <span className="text-sm font-semibold text-emerald-800">{count} sản phẩm</span>
          </div>

          {items.length ? (
            <>
              <div className="max-h-72 overflow-y-auto py-2">
                {items.map((item) => (
                  <div key={item.productId} className="grid grid-cols-[56px_1fr_auto] items-start gap-3 border-b border-stone-100 py-3 last:border-b-0">
                    <Link
                      href={`/products/${item.slug}`}
                      aria-label={item.name}
                      className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border border-stone-100 bg-stone-50"
                    >
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <Leaf size={20} className="text-emerald-700" />
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-semibold text-stone-950 hover:text-emerald-800">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-stone-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                      <strong className="mt-1 block text-sm text-amber-700">
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-sm font-semibold text-stone-600">Tạm tính</span>
                <strong className="text-base text-stone-950">{formatCurrency(total)}</strong>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/cart" className="flex h-10 items-center justify-center rounded-md border border-emerald-700 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
                  Xem giỏ hàng
                </Link>
                <Link href="/checkout" className="flex h-10 items-center justify-center rounded-md bg-emerald-800 text-sm font-semibold text-white hover:bg-emerald-900">
                  Thanh toán
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="font-semibold text-stone-950">Giỏ hàng đang trống</p>
              <Link href="/products" className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900">
                Xem sản phẩm
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
