import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="text-xl font-semibold">{settings.brandName}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
            Hệ sinh thái phân bón chất lượng cao, đồng hành cùng nhà vườn trong từng giai đoạn:
            phục hồi đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.
          </p>
        </div>
        <div>
          <p className="font-semibold">Liên kết</p>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/products">Sản phẩm</Link>
            <Link href="/news">Tin tức</Link>
            <Link href="/admin">CMS Admin</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Hỗ trợ</p>
          <div className="mt-3 grid gap-3 text-sm text-stone-300">
            <p className="flex gap-2"><Phone size={16} /> {settings.hotline}</p>
            <p className="flex gap-2"><Mail size={16} /> {settings.email}</p>
            <p className="flex gap-2"><MapPin size={16} /> {settings.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-800 px-4 py-4 text-center text-xs text-stone-400">
        Copyright 2026 © Phanbonmax8000.com
      </div>
    </footer>
  );
}
