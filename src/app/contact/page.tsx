import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/contact-page-content";
import { getSettings } from "@/lib/data";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Liên hệ" };

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <PublicLayout>
      <ContactPageContent settings={settings} />
    </PublicLayout>
  );
}
