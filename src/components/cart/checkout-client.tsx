"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { createCheckoutOrder } from "@/lib/actions";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/lib/types";

const CART_KEY = "max8000-cart";
const CART_UPDATED_EVENT = "max8000-cart-updated";

export function CheckoutClient() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [message, setMessage] = useState("");
    const [orderCode, setOrderCode] = useState("");
    const [isPending, startTransition] = useTransition();
    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items],
    );

    useEffect(() => {
        const id = window.requestAnimationFrame(() => {
            setItems(JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"));
        });
        return () => window.cancelAnimationFrame(id);
    }, []);

    function submit(formData: FormData) {
        startTransition(async () => {
            const result = await createCheckoutOrder({
                customerName: formData.get("customerName"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                province: formData.get("province"),
                note: formData.get("note"),
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            });
            setMessage(result.message);
            if (result.ok) {
                setOrderCode(result.orderCode ?? "");
                localStorage.removeItem(CART_KEY);
                setItems([]);
                window.dispatchEvent(new Event(CART_UPDATED_EVENT));
            }
        });
    }

    if (orderCode) {
        return (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-8">
                <h1 className="text-2xl font-bold text-emerald-950">
                    Đặt hàng thành công
                </h1>
                <p className="mt-3 text-emerald-900">
                    Mã đơn của anh là <strong>{orderCode}</strong>. Admin sẽ gọi
                    hoặc Zalo xác nhận.
                </p>
                <Link
                    className="mt-6 inline-flex rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white"
                    href="/products"
                >
                    Tiếp tục xem sản phẩm
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <form
                action={submit}
                className="rounded-lg border border-stone-200 bg-white p-5"
            >
                <h1 className="text-2xl font-bold text-stone-950">
                    Thông tin đặt hàng
                </h1>
                <div className="mt-6 grid gap-4">
                    <label className="grid gap-2 text-sm font-semibold text-stone-700">
                        Họ tên
                        <input
                            name="customerName"
                            required
                            className="h-11 rounded-md border border-stone-300 px-3 font-normal"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-stone-700">
                        Số điện thoại
                        <input
                            name="phone"
                            required
                            className="h-11 rounded-md border border-stone-300 px-3 font-normal"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-stone-700">
                        Tỉnh/thành
                        <input
                            name="province"
                            required
                            className="h-11 rounded-md border border-stone-300 px-3 font-normal"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-stone-700">
                        Địa chỉ nhận hàng
                        <textarea
                            name="address"
                            required
                            rows={3}
                            className="rounded-md border border-stone-300 px-3 py-2 font-normal"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-stone-700">
                        Ghi chú
                        <textarea
                            name="note"
                            rows={3}
                            className="rounded-md border border-stone-300 px-3 py-2 font-normal"
                        />
                    </label>
                </div>
                <button
                    disabled={isPending || !items.length}
                    className="mt-5 h-12 rounded-md bg-emerald-800 px-5 font-semibold text-white disabled:bg-stone-300"
                >
                    {isPending ? "Đang gửi đơn..." : "Gửi đơn COD"}
                </button>
                {message ? (
                    <p className="mt-3 text-sm font-semibold text-amber-700">
                        {message}
                    </p>
                ) : null}
            </form>
            <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5">
                <p className="text-lg font-bold text-stone-950">Đơn hàng</p>
                <div className="mt-4 grid gap-3">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex justify-between gap-3 text-sm"
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>
                            <strong>
                                {formatCurrency(item.price * item.quantity)}
                            </strong>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-stone-100 pt-4">
                    <span>Tổng</span>
                    <strong className="text-amber-700">
                        {formatCurrency(total)}
                    </strong>
                </div>
            </aside>
        </div>
    );
}
