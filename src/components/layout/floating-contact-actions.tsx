import Image from "next/image";
import { Phone } from "lucide-react";
import { getSettings } from "@/lib/data";

function getPhoneHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

export async function FloatingContactActions() {
  const settings = await getSettings();
  const phoneHref = getPhoneHref(settings.hotline);

  if (!phoneHref && !settings.zaloUrl) return null;

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
