import Image from "next/image";
import Link from "next/link";
import { Leaf, Mail, Phone } from "lucide-react";
import { CartLink } from "@/components/cart/cart-link";
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
      <div className="hidden border-b border-emerald-100 bg-emerald-50 text-sm font-semibold text-emerald-950 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2">
            <Leaf size={15} className="text-emerald-700" />
            {settings.brandName} - {settings.tagline} theo từng giai đoạn
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${settings.email}`} className="group flex items-center gap-2">
              <Mail size={15} className="contact-wiggle text-emerald-700" />
              {settings.email}
            </a>
            <a href={`tel:${settings.hotline.replace(/\s/g, "")}`} className="group flex items-center gap-2 text-amber-700">
              <Phone size={15} className="contact-shake" />
              {settings.hotline}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold text-emerald-900">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.brandName}
              width={124}
              height={66}
              priority
              className="h-12 w-auto object-contain"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-800 text-white">
              <Leaf size={23} />
            </span>
          )}
          <span className="leading-tight">
            <span className="sr-only">{settings.brandName}</span>
            <span className="hidden text-xs font-medium text-stone-500 sm:block">{settings.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-stone-800 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-emerald-800">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.hotline.replace(/\s/g, "")}`}
            className="hidden h-11 items-center gap-2 rounded-md bg-amber-100 px-3 text-sm font-semibold text-amber-900 sm:flex lg:hidden"
          >
            <Phone size={16} className="contact-shake" />
            {settings.hotline}
          </a>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
