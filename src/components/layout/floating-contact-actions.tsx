import Image from "next/image";
import { Phone } from "lucide-react";
import { getSettings } from "@/lib/data";

const FACEBOOK_URL = "https://facebook.com/nongnghiepxanhvn2026";

function getPhoneHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

export async function FloatingContactActions() {
  const settings = await getSettings();
  const phoneHref = getPhoneHref(settings.hotline);

  return (
    <div className="fixed right-3 bottom-[20vh] z-50 flex flex-col gap-3 sm:right-5">
      {settings.zaloUrl ? (
        <a
          href={settings.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo tư vấn"
          title="Nhắn Zalo tư vấn"
          className="flex size-14 items-center justify-center rounded-full bg-[rgba(33,150,243,0.7)] shadow-lg shadow-emerald-950/25 transition hover:-translate-y-0.5 hover:bg-[rgba(33,150,243,0.82)] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
        >
          <Image src="/zalo-icon.svg" alt="" width={34} height={34} className="contact-bounce size-9" />
        </a>
      ) : null}

      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener"
        aria-label="Mở Facebook MAX 8000"
        title="Facebook MAX 8000"
        className="flex size-14 items-center justify-center rounded-full bg-[#1877f2] shadow-lg shadow-emerald-950/25 transition hover:-translate-y-0.5 hover:bg-[#0f6be8] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        <Image src="/facebook-icon.svg" alt="" width={32} height={32} className="size-8 shrink-0" />
      </a>

      {phoneHref ? (
        <a
          href={phoneHref}
          aria-label={`Gọi hotline ${settings.hotline}`}
          title={`Gọi hotline ${settings.hotline}`}
          className="flex size-14 items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg shadow-emerald-950/25 transition hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          <Phone size={25} strokeWidth={2.7} className="contact-shake" />
        </a>
      ) : null}
    </div>
  );
}
