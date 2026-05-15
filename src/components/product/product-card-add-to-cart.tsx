"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { CartItem, Product } from "@/lib/types";

const CART_KEY = "max8000-cart";
const CART_UPDATED_EVENT = "max8000-cart-updated";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function ProductCardAddToCart({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function addToCart() {
    const current = readCart();
    const existing = current.find((item) => item.productId === product.id);
    const next = existing
      ? current.map((item) =>
          item.productId === product.id ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item,
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
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    setAdded(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-800 text-white transition hover:bg-emerald-900"
      aria-label={`Thêm ${product.name} vào giỏ hàng`}
      title={added ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
    >
      {added ? <Check size={18} /> : <ShoppingBag size={18} />}
    </button>
  );
}
