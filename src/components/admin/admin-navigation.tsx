"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  FileText,
  MessageSquareQuote,
  Package,
  Settings,
  ShoppingBag,
  Tags,
} from "lucide-react";
import clsx from "clsx";

type AdminNotificationCounts = {
  newOrders: number;
  newContacts: number;
};

type AdminLink = {
  href: string;
  label: string;
  icon: typeof BarChart3;
  badgeKey?: keyof AdminNotificationCounts;
};

const primaryLinks: AdminLink[] = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: Tags },
  { href: "/admin/testimonials", label: "Feedback khách", icon: MessageSquareQuote },
  { href: "/admin/contacts", label: "Liên hệ", icon: ClipboardList, badgeKey: "newContacts" },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag, badgeKey: "newOrders" },
  { href: "/admin/posts", label: "Tin tức", icon: FileText },
];

const settingsLinks: AdminLink[] = [
  { href: "/admin/settings", label: "Cấu hình website", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function NavigationGroup({
  title,
  links,
  counts,
}: {
  title: string;
  links: AdminLink[];
  counts: AdminNotificationCounts;
}) {
  const pathname = usePathname();

  return (
    <div className="px-4">
      <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.12em] text-stone-400">{title}</p>
      <nav className="grid gap-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          const count = item.badgeKey ? counts[item.badgeKey] : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition",
                active
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
              )}
            >
              <span
                className={clsx(
                  "grid size-8 place-items-center rounded-lg",
                  active ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800",
                )}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {count > 0 ? (
                <span
                  className={clsx(
                    "grid min-w-6 place-items-center rounded-full px-2 py-0.5 text-xs font-black",
                    active ? "bg-white text-emerald-800" : "bg-orange-500 text-white",
                  )}
                >
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AdminNavigation({ counts = { newOrders: 0, newContacts: 0 } }: { counts?: AdminNotificationCounts }) {
  return (
    <div className="py-6">
      <div className="grid gap-8">
        <NavigationGroup title="Nghiệp vụ" links={primaryLinks} counts={counts} />
        <NavigationGroup title="Hệ thống" links={settingsLinks} counts={counts} />
      </div>
    </div>
  );
}
