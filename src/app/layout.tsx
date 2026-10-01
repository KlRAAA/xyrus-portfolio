import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { site } from "@/data/portfolio";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { IntroSkipper } from "@/components/layout/IntroSkipper";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-bricolage",
  display: "swap",
});
// Mono only appears below the fold, so it shouldn't compete with the hero for bandwidth.
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = `${site.shortName} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    url: "/",
    siteName: site.shortName,
    type: "website",
    locale: "en_PH",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = { themeColor: "#0f120d", colorScheme: "dark" };

// Runs before paint: the hero intro plays once per browser session.
const introScript = `try{if(sessionStorage.getItem("xd-intro")){document.documentElement.dataset.intro="skip"}else{sessionStorage.setItem("xd-intro","1")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-cream px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <IntroSkipper />
        {children}
      </body>
    </html>
  );
}
