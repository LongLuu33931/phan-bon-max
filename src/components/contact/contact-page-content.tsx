import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import type { SiteSettings } from "@/lib/types";

export function ContactPageContent({ settings }: { settings: SiteSettings }) {
  return (
    <section className="section grid gap-8 py-12 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="font-semibold text-emerald-800">Liên hệ</p>
        <h1 className="mt-2 text-4xl font-black text-stone-950">Tư vấn sản phẩm MAX 8000</h1>
        <p className="mt-4 leading-7 text-stone-600">
          Gửi thông tin vườn, loại cây và giai đoạn hiện tại để được tư vấn chọn sản phẩm phù hợp.
        </p>
        <div className="mt-6 grid gap-4">
          <a href={`tel:${settings.hotline.replace(/\s/g, "")}`} className="flex gap-3 rounded-xl bg-amber-50 p-4 font-semibold text-amber-900">
            <Phone /> {settings.hotline}
          </a>
          <a href={`mailto:${settings.email}`} className="flex gap-3 rounded-xl bg-stone-50 p-4 font-semibold text-stone-800">
            <Mail /> {settings.email}
          </a>
          <p className="flex gap-3 rounded-xl bg-stone-50 p-4 font-semibold text-stone-800">
            <MapPin /> {settings.address}
          </p>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
