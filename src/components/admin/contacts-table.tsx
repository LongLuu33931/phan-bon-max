import { Mail, Phone } from "lucide-react";
import { ContactDetailDialog } from "@/components/admin/contact-detail-dialog";
import type { ContactMessage } from "@/lib/types";

const statusLabels: Record<ContactMessage["status"], string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  closed: "Đã xử lý",
};

const statusStyles: Record<ContactMessage["status"], string> = {
  new: "bg-orange-50 text-orange-700",
  contacted: "bg-blue-50 text-blue-700",
  closed: "bg-emerald-50 text-emerald-700",
};

export function ContactsTable({ messages }: { messages: ContactMessage[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      {messages.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-stone-100 bg-stone-50/80 text-xs font-black uppercase tracking-[0.08em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Nội dung</th>
                <th className="px-5 py-4">Liên hệ</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày gửi</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {messages.map((message) => (
                <tr key={message.id} className="align-middle transition hover:bg-stone-50">
                  <td className="px-5 py-4">
                    <p className="font-black text-stone-950">{message.customerName}</p>
                    <p className="mt-1 text-xs font-semibold text-stone-500">{message.province || "Chưa có tỉnh/thành"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="line-clamp-2 max-w-xl text-sm font-semibold leading-6 text-stone-700">{message.message}</p>
                    {message.crop ? <p className="mt-1 text-xs font-bold text-stone-500">Cây/vườn: {message.crop}</p> : null}
                  </td>
                  <td className="px-5 py-4">
                    <a href={`tel:${message.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-xs font-black text-orange-700">
                      <Phone size={13} /> {message.phone}
                    </a>
                    {message.email ? (
                      <a href={`mailto:${message.email}`} className="mt-1 flex max-w-56 items-center gap-1 truncate text-xs font-semibold text-stone-500">
                        <Mail size={13} /> {message.email}
                      </a>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[message.status]}`}>
                      {statusLabels[message.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-stone-500">
                    {new Date(message.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ContactDetailDialog message={message} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-sm font-semibold text-stone-600">Chưa có form liên hệ nào.</div>
      )}
    </div>
  );
}
