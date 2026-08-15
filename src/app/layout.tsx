// eslint-disable-next-line filenames/match-exported
import getBaseUrl from "@/libs/getBaseUrl";
import {
  createPersonStructuredData,
  createWebSiteStructuredData,
  SITE_DESCRIPTION,
} from "@/libs/structuredData";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Righteous } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { type ReactNode } from "react";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import MobileMenu from "./_components/MobileMenu";
import Navigation from "./_components/Navigation";
import StructuredData from "./_components/StructuredData";
import ThemeToggle from "./_components/ThemeToggle";
import "github-markdown-css";
import "./globals.css";

// 欧文のナビゲーション用。708 と同じ書体。
const righteous = Righteous({ subsets: ["latin"], weight: "400" });
const jkg = localFont({
  display: "swap",
  fallback: ["sans-serif"],
  src: "./jkg.woff2",
});

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: "ja_JP",
    siteName: "kk-web",
    title: "kk-web",
    type: "website",
    url: getBaseUrl(),
  },
  title: "kk-web",
  twitter: {
    card: "summary_large_image",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body className={jkg.className}>
        <StructuredData data={createWebSiteStructuredData()} />
        <StructuredData data={createPersonStructuredData()} />
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <Background />
          <Frame />
          <ThemeToggle />
          <div className={righteous.className}>
            <Navigation />
          </div>
          {children}
          <div className={righteous.className}>
            <MobileMenu />
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" ? (
          // 計測は vercel.json の rewrite で /stats 配下に通している。
          <Script
            data-host-url="/stats"
            data-website-id="9dc0884b-8e4f-4127-a2fb-48c432a79fe3"
            defer={true}
            src="/stats/script.js"
          />
        ) : null}
      </body>
    </html>
  );
}
