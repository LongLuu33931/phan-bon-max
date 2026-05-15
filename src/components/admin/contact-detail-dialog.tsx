"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { ContactStatusForm } from "@/components/admin/contact-status-form";
import { formatDate } from "@/lib/format";
import type { ContactMessage } from "@/lib/types";

const statusLabels: Record<ContactMessage["status"], string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  closed: "Đã xử lý",
};

const statusStyles: Record<ContactMessage["status"], string> = {
  new: "bg-orange-50 text-orange-700 ring-orange-100",
  contacted: "bg-blue-50 text-blue-700 ring-blue-100",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export function ContactDetailDialog({ message }: { message: ContactMessage }) {
  const [open, setOpen] = useState(false);

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
            aria-labelledby={`contact-title-${message.id}`}
            className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-left shadow-[0_32px_90px_rgba(15,23,42,0.25)] ring-1 ring-black/5"
          >
            <header className="border-b border-stone-200 px-6 py-5">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Liên hệ</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusStyles[message.status]}`}>
                      {statusLabels[message.status]}
                    </span>
                  </div>
                  <h2 id={`contact-title-${message.id}`} className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                    {message.customerName}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-stone-500">{formatDate(message.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-100 hover:text-stone-950"
                  aria-label="Đóng chi tiết liên hệ"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="max-h-[calc(92vh-116px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <section className="rounded-2xl border border-stone-200 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-500">Thông tin khách hàng</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-xl bg-stone-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Số điện thoại</p>
                      <a href={`tel:${message.phone.replace(/\s/g, "")}`} className="mt-2 inline-flex text-sm font-black text-orange-700">
                        {message.phone}
                      </a>
                    </div>
                    {message.email ? (
                      <div className="rounded-xl bg-stone-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Email</p>
                        <a href={`mailto:${message.email}`} className="mt-2 inline-flex break-all text-sm font-semibold text-stone-800">
                          {message.email}
                        </a>
                      </div>
                    ) : null}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-stone-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Tỉnh/thành</p>
                        <p className="mt-2 text-sm font-semibold text-stone-800">{message.province || "Chưa có"}</p>
                      </div>
                      <div className="rounded-xl bg-stone-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-stone-500">Cây/vườn</p>
                        <p className="mt-2 text-sm font-semibold text-stone-800">{message.crop || "Chưa có"}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-4 text-amber-950">
                      <p className="text-xs font-black uppercase tracking-[0.1em] text-amber-700">Nội dung cần tư vấn</p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6">{message.message}</p>
                    </div>
                  </div>
                </section>

                <aside className="rounded-2xl border border-emerald-100 bg-emerald-50/45 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-800">Trạng thái xử lý</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950/75">Cập nhật sau khi đã gọi hoặc xử lý xong yêu cầu.</p>
                  <div className="mt-4">
                    <ContactStatusForm messageId={message.id} status={message.status} />
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
