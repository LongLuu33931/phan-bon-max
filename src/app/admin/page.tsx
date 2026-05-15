import Link from "next/link";
import { ArrowRight, ClipboardList, MessageSquareQuote, Newspaper, Package, ShoppingBag } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAllProductsForAdmin, getAllTestimonialsForAdmin, getContactMessagesForAdmin, getOrdersForAdmin, getPosts } from "@/lib/data";
import type { ContactMessage, Order } from "@/lib/types";

const cardStyles = [
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
  "bg-violet-50 text-violet-700",
  "bg-orange-50 text-orange-700",
];

const orderStatusLabels: Record<Order["status"], string> = {
  new: "Mới",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Đã giao",
  cancelled: "Hủy",
};

const contactStatusLabels: Record<ContactMessage["status"], string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  closed: "Đã xử lý",
};

export default async function AdminPage() {
  const [products, posts, testimonials, orders, contacts] = await Promise.all([
    getAllProductsForAdmin(),
    getPosts(),
    getAllTestimonialsForAdmin(),
    getOrdersForAdmin(),
    getContactMessagesForAdmin(),
  ]);

  const stats = [
    { href: "/admin/products", label: "Sản phẩm", value: products.length, icon: Package },
    { href: "/admin/testimonials", label: "Feedback", value: testimonials.length, icon: MessageSquareQuote },
    { href: "/admin/contacts", label: "Liên hệ", value: contacts.length, icon: ClipboardList },
    { href: "/admin/orders", label: "Đơn hàng", value: orders.length, icon: ShoppingBag },
    { href: "/admin/posts", label: "Tin tức", value: posts.length, icon: Newspaper },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Tổng quan</p>
        <h1 className="text-3xl font-black tracking-tight text-stone-950">Dashboard</h1>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-stone-500">{item.label}</p>
                  <p className="mt-4 text-4xl font-black tracking-tight text-stone-950">{item.value}</p>
                </div>
                <span className={`grid size-14 place-items-center rounded-2xl ${cardStyles[index]}`}>
                  <Icon size={25} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <h2 className="text-lg font-black">Đơn hàng mới</h2>
              <p className="mt-1 text-sm text-stone-500">Các đơn gần nhất từ checkout.</p>
            </div>
            <Link href="/admin/orders" className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-bold">
              Mở rộng <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="grid grid-cols-[1fr_auto] gap-4 p-5">
                <div>
                  <p className="font-bold text-stone-950">
                    {order.orderCode} - {order.customerName}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                    {order.phone} / {order.province}
                  </p>
                </div>
                <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {orderStatusLabels[order.status]}
                </span>
              </div>
            ))}
            {!orders.length ? <div className="p-5 text-sm font-semibold text-stone-500">Chưa có đơn hàng.</div> : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div>
              <h2 className="text-lg font-black">Liên hệ mới</h2>
              <p className="mt-1 text-sm text-stone-500">Form khách gửi từ trang Liên hệ.</p>
            </div>
            <Link href="/admin/contacts" className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-bold">
              Mở rộng <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {contacts.slice(0, 5).map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 p-5">
                <div>
                  <p className="font-bold text-stone-950">{item.customerName}</p>
                  <p className="mt-1 line-clamp-1 text-sm text-stone-500">{item.message}</p>
                </div>
                <span className="h-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                  {contactStatusLabels[item.status]}
                </span>
              </div>
            ))}
            {!contacts.length ? <div className="p-5 text-sm font-semibold text-stone-500">Chưa có liên hệ.</div> : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
