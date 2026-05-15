import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { getCategories, getSettings } from "@/lib/data";

function getPhoneHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

export async function SiteFooter() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const phoneHref = getPhoneHref(settings.hotline);
  const emailHref = settings.email.trim() ? `mailto:${settings.email.trim()}` : undefined;
  const activeCategories = categories.filter((category) => category.isActive).slice(0, 5);

  return (
    <footer className="border-t border-emerald-100 bg-emerald-900 text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-emerald-700 bg-emerald-800 p-5">
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-amber-200">Cần chọn sản phẩm cho vườn?</p>
            <p className="mt-2 max-w-5xl text-lg font-black leading-snug text-white sm:text-xl lg:text-2xl">
              Gửi tình trạng cây, đội ngũ MAX 8000 tư vấn dòng phù hợp theo từng giai đoạn.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {phoneHref ? (
              <a href={phoneHref} className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-amber-400 px-4 text-sm font-black text-emerald-950 transition hover:bg-amber-300">
                <Phone size={17} />
                {settings.hotline}
              </a>
            ) : null}
            {settings.zaloUrl ? (
              <a href={settings.zaloUrl} className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-white px-4 text-sm font-black text-emerald-900 transition hover:bg-emerald-50">
                <Image src="/zalo-icon.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
                Zalo tư vấn
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.45fr_0.75fr_0.9fr_1.1fr] lg:px-8">
        <div>
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
            Hệ sinh thái phân bón đồng hành cùng nhà vườn trong từng giai đoạn: phục hồi đất, kích rễ, bung đọt,
            ra hoa, đậu trái và nuôi trái.
          </p>
          <div className="mt-5 grid gap-1 text-xs leading-5 text-emerald-50/85 xl:grid-cols-2">
            {["Tư vấn theo tình trạng cây", "Giao hàng linh hoạt", "Thông tin sản phẩm rõ ràng", "Phù hợp nhà vườn và đại lý"].map((item) => (
              <span key={item} className="inline-flex min-w-0 items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-amber-200" />
                <span className="min-w-0 break-words">{item}</span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold">Liên kết</p>
          <div className="mt-3 grid gap-2 text-sm text-emerald-50/80">
            <Link href="/products" className="flex min-h-11 items-center transition hover:text-white">Sản phẩm</Link>
            <Link href="/about" className="flex min-h-11 items-center transition hover:text-white">Về MAX 8000</Link>
            <Link href="/news" className="flex min-h-11 items-center transition hover:text-white">Tin tức</Link>
            <Link href="/contact" className="flex min-h-11 items-center transition hover:text-white">Liên hệ</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold">Danh mục sản phẩm</p>
          <div className="mt-3 grid gap-2 text-sm text-emerald-50/80">
            {activeCategories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="flex min-h-10 items-center gap-2 transition hover:text-white">
                <ArrowRight size={14} className="shrink-0 text-amber-200" />
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold">Hỗ trợ</p>
          <div className="mt-3 grid gap-3 text-sm text-emerald-50/80">
            <p className="flex min-w-0 gap-2">
              <Phone size={16} className="shrink-0 text-amber-200" />
              {phoneHref ? (
                <a href={phoneHref} className="min-w-0 break-words transition hover:text-white">
                  {settings.hotline}
                </a>
              ) : (
                <span className="min-w-0 break-words">{settings.hotline}</span>
              )}
            </p>
            <p className="flex min-w-0 gap-2">
              <Mail size={16} className="shrink-0 text-amber-200" />
              {emailHref ? (
                <a href={emailHref} className="min-w-0 break-words transition hover:text-white">
                  {settings.email}
                </a>
              ) : (
                <span className="min-w-0 break-words">{settings.email}</span>
              )}
            </p>
            <p className="flex min-w-0 gap-2">
              <MapPin size={16} className="shrink-0 text-amber-200" />
              <span className="min-w-0 break-words">{settings.address}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-800 px-4 py-4 text-center text-xs text-emerald-50/65">
        Copyright 2026 © Phanbonmax8000.com
      </div>
    </footer>
  );
}
