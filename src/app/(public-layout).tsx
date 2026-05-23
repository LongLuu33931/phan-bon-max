import type { ReactNode } from "react";
import { FloatingContactActions } from "@/components/layout/floating-contact-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FloatingContactActions />
      <SiteFooter />
    </>
  );
}
