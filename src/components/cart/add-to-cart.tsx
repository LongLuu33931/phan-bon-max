"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";

const CART_KEY = "max8000-cart";
const CART_UPDATED_EVENT = "max8000-cart-updated";

export function AddToCart({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  function changeQuantity(next: number) {
    setQuantity(Math.min(99, Math.max(1, next)));
  }

  function add() {
    const current = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as Array<{
      productId: string;
      quantity: number;
    }>;
    const existing = current.find((item) => item.productId === product.id);
    const next = existing
      ? current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [
          ...current,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            thumbnailUrl: product.thumbnailUrl,
            quantity,
          },
        ];

    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setAdded(true);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-12 w-36 items-center justify-between rounded-md border border-stone-300 bg-white">
        <button
          type="button"
          onClick={() => changeQuantity(quantity - 1)}
          aria-label="Giảm số lượng"
          className="flex h-full w-11 items-center justify-center text-stone-600 hover:text-emerald-800 disabled:text-stone-300"
          disabled={quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <input
          aria-label="Số lượng"
          inputMode="numeric"
          value={quantity}
          onChange={(event) => changeQuantity(Number(event.target.value) || 1)}
          className="h-full w-12 border-x border-stone-200 text-center text-sm font-bold text-stone-950 outline-none"
        />
        <button
          type="button"
          onClick={() => changeQuantity(quantity + 1)}
          aria-label="Tăng số lượng"
          className="flex h-full w-11 items-center justify-center text-stone-600 hover:text-emerald-800 disabled:text-stone-300"
          disabled={quantity >= 99}
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={add}
        className="flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white hover:bg-emerald-900"
      >
        <ShoppingCart size={18} />
        {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
      </button>
    </div>
  );
}
