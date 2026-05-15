"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { OrderCustomerInfoForm } from "@/components/admin/order-customer-info-form";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/lib/types";

const statusLabels: Record<Order["status"], string> = {
  new: "Mới",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Đã giao hàng",
  cancelled: "Hủy",
};

const statusStyles: Record<Order["status"], string> = {
  new: "bg-orange-50 text-orange-700 ring-orange-100",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-100",
  shipping: "bg-amber-50 text-amber-700 ring-amber-100",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-stone-100 text-stone-700 ring-stone-200",
};

function getItemCount(order: Order) {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function OrderDetailDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const itemCount = getItemCount(order);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-xs font-black text-stone-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-sm"
      >
        <Eye size={15} />
        Chi tiết
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4 backdrop-blur-[2px]" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`order-title-${order.id}`}
            className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white text-left shadow-[0_32px_90px_rgba(15,23,42,0.25)] ring-1 ring-black/5"
          >
            <header className="border-b border-stone-200 px-6 py-5">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Đơn hàng</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusStyles[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <h2 id={`order-title-${order.id}`} className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                    {order.orderCode}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-stone-500">
                    <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                    <span>{itemCount} sản phẩm</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
                  aria-label="Đóng chi tiết đơn hàng"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="max-h-[calc(92vh-116px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-500">Khách hàng</p>
                      <h3 className="mt-2 text-xl font-black text-stone-950">{order.customerName}</h3>
                    </div>
                    <a
                      href={`tel:${order.phone.replace(/\s/g, "")}`}
                      className="inline-flex h-10 w-fit items-center rounded-xl bg-orange-50 px-3 text-sm font-black text-orange-700 transition hover:bg-orange-100"
                    >
                      {order.phone}
                    </a>
                  </div>

                  <div className="mt-5 rounded-xl bg-stone-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Sửa thông tin giao hàng</p>
                    <div className="mt-3">
                      <OrderCustomerInfoForm order={order} />
                    </div>
                  </div>
                </section>

                <aside className="rounded-2xl border border-emerald-100 bg-emerald-50/45 p-5 text-left">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-800">Trạng thái xử lý</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950/75">Cập nhật trạng thái đơn hàng tại đây.</p>
                  <div className="mt-4">
                    <OrderStatusForm orderId={order.id} status={order.status} />
                  </div>
                </aside>
              </div>

              <section className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="grid gap-3 border-b border-stone-200 bg-stone-50/70 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <h3 className="text-base font-black text-stone-950">Sản phẩm trong đơn</h3>
                    <p className="mt-1 text-sm font-semibold text-stone-500">{order.items.length} dòng sản phẩm</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Tổng tiền</p>
                    <p className="mt-1 text-xl font-black text-stone-950">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_80px_130px] sm:items-center">
                      <div className="min-w-0 text-left">
                        <p className="break-words text-sm font-black leading-6 text-stone-950">{item.productName}</p>
                        <p className="mt-0.5 text-sm font-semibold text-stone-500">{formatCurrency(item.price)} / sản phẩm</p>
                      </div>
                      <p className="text-sm font-bold text-stone-500 sm:text-right">x {item.quantity}</p>
                      <p className="text-base font-black text-stone-950 sm:text-right">{formatCurrency(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
