import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Liên hệ" };

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <PublicLayout>
      <section className="section grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-semibold text-emerald-800">Liên hệ</p>
          <h1 className="mt-2 text-4xl font-black text-stone-950">Tư vấn sản phẩm MAX 8000</h1>
          <p className="mt-4 leading-7 text-stone-600">
            Gửi thông tin vườn, loại cây và giai đoạn hiện tại để được tư vấn chọn sản phẩm phù hợp.
          </p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="grid gap-4">
            <a href={`tel:${settings.hotline.replace(/\s/g, "")}`} className="flex gap-3 rounded-md bg-amber-50 p-4 font-semibold text-amber-900">
              <Phone /> {settings.hotline}
            </a>
            <a href={`mailto:${settings.email}`} className="flex gap-3 rounded-md bg-stone-50 p-4 font-semibold text-stone-800">
              <Mail /> {settings.email}
            </a>
            <p className="flex gap-3 rounded-md bg-stone-50 p-4 font-semibold text-stone-800">
              <MapPin /> {settings.address}
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
