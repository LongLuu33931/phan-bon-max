import type { ReactNode } from "react";
import { FloatingContactActions } from "@/components/layout/floating-contact-actions";
import { PromoPopup } from "@/components/layout/promo-popup";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSettings } from "@/lib/data";

export async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FloatingContactActions />
      <SiteFooter />
      <PromoPopup promoPopup={settings.promoPopup} hotline={settings.hotline} zaloUrl={settings.zaloUrl} />
    </>
  );
}
