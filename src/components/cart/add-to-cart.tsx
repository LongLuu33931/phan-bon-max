"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";

const CART_KEY = "max8000-cart";

export function AddToCart({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  function add() {
    const current = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as Array<{
      productId: string;
      quantity: number;
    }>;
    const existing = current.find((item) => item.productId === product.id);
    const next = existing
      ? current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [
          ...current,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            thumbnailUrl: product.thumbnailUrl,
            quantity: 1,
          },
        ];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setAdded(true);
    window.dispatchEvent(new Event("max8000-cart-updated"));
  }

  return (
    <button
      type="button"
      onClick={add}
      className="flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white hover:bg-emerald-900"
    >
      <ShoppingCart size={18} />
      {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
    </button>
  );
}
