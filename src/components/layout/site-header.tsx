import Link from "next/link";
import { Leaf, Phone, ShoppingCart } from "lucide-react";
import { getSettings } from "@/lib/data";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/news", label: "Tin tức" },
  { href: "/contact", label: "Liên hệ" },
];

export async function SiteHeader() {
  const settings = await getSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-emerald-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-800 text-white">
            <Leaf size={22} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg">MAX 8000</span>
            <span className="hidden text-xs font-medium text-stone-500 sm:block">Dinh dưỡng cây trồng</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-emerald-800">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.hotline.replace(/\s/g, "")}`}
            className="hidden h-10 items-center gap-2 rounded-md bg-amber-100 px-3 text-sm font-semibold text-amber-900 sm:flex"
          >
            <Phone size={16} />
            {settings.hotline}
          </a>
          <Link
            href="/cart"
            aria-label="Giỏ hàng"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-stone-700 hover:border-emerald-700 hover:text-emerald-800"
          >
            <ShoppingCart size={19} />
          </Link>
        </div>
      </div>
    </header>
  );
}
