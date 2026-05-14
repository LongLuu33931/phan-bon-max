import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://phanbonmax8000.com"),
  title: {
    default: "MAX 8000 - Phân bón thế hệ mới",
    template: "%s | MAX 8000",
  },
  description:
    "Hệ sinh thái phân bón MAX 8000 giúp cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
