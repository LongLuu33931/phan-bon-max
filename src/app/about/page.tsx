import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";
import { PublicLayout } from "../(public-layout)";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <PublicLayout>
      <AboutContent />
    </PublicLayout>
  );
}
