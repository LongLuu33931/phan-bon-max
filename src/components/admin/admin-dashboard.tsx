import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, MessageSquareQuote, Newspaper, Package, ShoppingBag } from "lucide-react";
import type { ContactMessage, Order, Post, Product, Testimonial } from "@/lib/types";

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

type AdminDashboardProps = {
  products: Product[];
  posts: Post[];
  testimonials: Testimonial[];
  orders: Order[];
  contacts: ContactMessage[];
};

export function AdminDashboard({ products, posts, testimonials, orders, contacts }: AdminDashboardProps) {
  const stats = [
    { href: "/admin/products", label: "Sản phẩm", value: products.length, icon: Package },
    { href: "/admin/testimonials", label: "Feedback", value: testimonials.length, icon: MessageSquareQuote },
    { href: "/admin/contacts", label: "Liên hệ", value: contacts.length, icon: ClipboardList },
    { href: "/admin/orders", label: "Đơn hàng", value: orders.length, icon: ShoppingBag },
    { href: "/admin/posts", label: "Tin tức", value: posts.length, icon: Newspaper },
  ];

  return (
    <>
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
        <DashboardPreview title="Đơn hàng mới" description="Các đơn gần nhất từ checkout." href="/admin/orders">
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
        </DashboardPreview>

        <DashboardPreview title="Liên hệ mới" description="Form khách gửi từ trang Liên hệ." href="/admin/contacts">
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
        </DashboardPreview>
      </div>
    </>
  );
}

function DashboardPreview({
  title,
  description,
  href,
  children,
}: {
  title: string;
  description: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-stone-100 p-5">
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          <p className="mt-1 text-sm text-stone-500">{description}</p>
        </div>
        <Link href={href} className="inline-flex h-10 items-center gap-2 rounded-lg border border-stone-200 px-3 text-sm font-bold">
          Mở rộng <ArrowRight size={16} />
        </Link>
      </div>
      <div className="divide-y divide-stone-100">{children}</div>
    </section>
  );
}
