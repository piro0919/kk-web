// eslint-disable-next-line filenames/match-exported
import { routing } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import {
  createPersonStructuredData,
  createWebSiteStructuredData,
} from "@/libs/structuredData";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Righteous } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Script from "next/script";
import { type ReactNode } from "react";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import LocaleSwitch from "./_components/LocaleSwitch";
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

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({ locale: locale as "en" | "ja", type: "website" });
}

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const websiteStructuredData = await createWebSiteStructuredData({
    locale: locale as "en" | "ja",
  });

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={jkg.className}>
        <StructuredData data={websiteStructuredData} />
        <StructuredData data={createPersonStructuredData()} />
        <NextIntlClientProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="light">
            <Background />
            <Frame />
            <ThemeToggle />
            <LocaleSwitch />
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
        </NextIntlClientProvider>
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
