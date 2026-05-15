import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";

function getPhoneHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

export async function SiteFooter() {
  const settings = await getSettings();
  const phoneHref = getPhoneHref(settings.hotline);
  const emailHref = settings.email.trim() ? `mailto:${settings.email.trim()}` : undefined;

  return (
    <footer className="border-t border-emerald-100 bg-emerald-900 text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.brandName}
              width={160}
              height={86}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <p className="text-xl font-semibold">{settings.brandName}</p>
          )}
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80">
            Hệ sinh thái phân bón chất lượng cao, đồng hành cùng nhà vườn trong từng giai đoạn:
            phục hồi đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.
          </p>
        </div>
        <div>
          <p className="font-semibold">Liên kết</p>
          <div className="mt-3 grid gap-2 text-sm text-emerald-50/80">
            <Link href="/products" className="flex min-h-11 items-center">Sản phẩm</Link>
            <Link href="/news" className="flex min-h-11 items-center">Tin tức</Link>
            <Link href="/contact" className="flex min-h-11 items-center">Liên hệ</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Hỗ trợ</p>
          <div className="mt-3 grid gap-3 text-sm text-emerald-50/80">
            <p className="flex min-w-0 gap-2">
              <Phone size={16} className="shrink-0" />
              {phoneHref ? (
                <a href={phoneHref} className="min-w-0 break-words transition hover:text-white">
                  {settings.hotline}
                </a>
              ) : (
                <span className="min-w-0 break-words">{settings.hotline}</span>
              )}
            </p>
            <p className="flex min-w-0 gap-2">
              <Mail size={16} className="shrink-0" />
              {emailHref ? (
                <a href={emailHref} className="min-w-0 break-words transition hover:text-white">
                  {settings.email}
                </a>
              ) : (
                <span className="min-w-0 break-words">{settings.email}</span>
              )}
            </p>
            <p className="flex min-w-0 gap-2"><MapPin size={16} className="shrink-0" /> <span className="min-w-0 break-words">{settings.address}</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-800 px-4 py-4 text-center text-xs text-emerald-50/65">
        Copyright 2026 © Phanbonmax8000.com
      </div>
    </footer>
  );
}
