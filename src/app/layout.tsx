import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
    variable: "--font-be-vietnam",
    subsets: ["latin", "vietnamese"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL ?? "https://phanbonmax8000.vn",
    ),
    title: {
        default: "MAX 8000 - Phân bón thế hệ mới",
        template: "%s | MAX 8000",
    },
    description:
        "Hệ sinh thái phân bón MAX 8000 giúp cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.",
    openGraph: {
        title: "MAX 8000 - Phân bón thế hệ mới",
        description:
            "Hệ sinh thái phân bón MAX 8000 giúp cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.",
        url: "https://phanbonmax8000.vn",
        siteName: "MAX 8000",
        images: [
            {
                url: "/images/thumbnail.png",
                width: 1774,
                height: 887,
                alt: "MAX 8000 - Phân bón thế hệ mới",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "MAX 8000 - Phân bón thế hệ mới",
        description:
            "Hệ sinh thái phân bón MAX 8000 giúp cải tạo đất, kích rễ, bung đọt, ra hoa, đậu trái và nuôi trái.",
        images: ["/images/thumbnail.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
            <body className="flex min-h-full flex-col">
                {children}
                <ToastProvider />
                <Script
                    id="meta-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '975422638556284');
fbq('track', 'PageView');`,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src="https://www.facebook.com/tr?id=975422638556284&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
            </body>
        </html>
    );
}
