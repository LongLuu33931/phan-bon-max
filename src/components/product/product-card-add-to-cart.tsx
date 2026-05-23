"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem, Product } from "@/lib/types";

const CART_KEY = "max8000-cart";
const CART_UPDATED_EVENT = "max8000-cart-updated";
const BUY_NOW_LABEL = "Mua ngay";
const ADDED_LABEL = "Đã thêm vào giỏ";

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
    const router = useRouter();

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
                  item.productId === product.id
                      ? { ...item, quantity: Math.min(99, item.quantity + 1) }
                      : item,
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
        router.push("/cart");

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setAdded(false), 1400);
    }

    return (
        <button
            type="button"
            onClick={addToCart}
            className="flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-emerald-800 px-2.5 text-xs font-semibold text-white transition hover:bg-emerald-900 sm:h-11 sm:px-4 sm:text-sm"
            aria-label={`${BUY_NOW_LABEL} ${product.name}`}
            title={added ? ADDED_LABEL : BUY_NOW_LABEL}
        >
            {added ? <>{ADDED_LABEL}</> : BUY_NOW_LABEL}
        </button>
    );
}
