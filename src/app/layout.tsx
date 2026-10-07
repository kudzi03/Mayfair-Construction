import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/config/site";
import { homeDescription, homeTitle } from "@/lib/metadata";
import { motionBootScript } from "@/lib/motion-boot";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Only the CRM and the coverage map's figures use it, so it is not preloaded on every page.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

const { google, bing } = site.verification;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: homeTitle, template: `%s | ${site.name}` },
  description: homeDescription,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_BW",
    siteName: site.name,
    title: homeTitle,
    description: homeDescription,
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: homeDescription },
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
  ...(google || bing
    ? { verification: { ...(google ? { google } : {}), ...(bing ? { other: { "msvalidate.01": bing } } : {}) } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#14120f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-BW" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Opt into motion styles only when JS runs, so content never hides without it. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js');${motionBootScript}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
