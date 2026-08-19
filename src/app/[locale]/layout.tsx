// eslint-disable-next-line filenames/match-exported
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Righteous } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { type ReactNode } from "react";
import env from "@/env";
import { routing, toLocale } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import {
  createPersonStructuredData,
  createWebSiteStructuredData,
} from "@/libs/structuredData";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import Hotjar from "./_components/Hotjar";
import LocaleSwitch from "./_components/LocaleSwitch";
import MobileMenu from "./_components/MobileMenu";
import Navigation from "./_components/Navigation";
import StructuredData from "./_components/StructuredData";
import SupportLink from "./_components/SupportLink";
import ThemeToggle from "./_components/ThemeToggle";
import jkgFont from "./jkgFont";
// 記事本文の書式（github-markdown-css と、その配色を data-theme に
// 紐づけ直す markdown-theme.css）はここでは読まない。使うのは記事ページ
// だけなので、Article が読む。全ページに載せると、記事一覧では 40KB 弱が
// 丸ごと未使用のまま描画を止めていた。
import "./jkg-font.css";
import "./zkgn-font.css";
import "./globals.css";

// 欧文の見出しとナビゲーション用。708 と同じ書体。
// CSS から var(--font-righteous) で参照する。
const righteous = Righteous({
  subsets: ["latin"],
  variable: "--font-righteous",
  weight: "400",
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

  return getMetadata({ locale: toLocale(locale), type: "website" });
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
    locale: toLocale(locale),
  });

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        {/* 本文の書体。CSS を読み終わるまで待たせない。 */}
        <link
          as="font"
          crossOrigin="anonymous"
          href={jkgFont}
          rel="preload"
          type="font/woff2"
        />
      </head>
      <body className={righteous.variable}>
        <StructuredData data={websiteStructuredData} />
        <StructuredData data={createPersonStructuredData()} />
        <NextIntlClientProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="system">
            <Background />
            <Frame />
            {/* 3つとも fixed で座標を指定するので、書いた順が見た目の順になる
                わけではない。左から並ぶとおりに書いて、Tab の移動順を合わせる。 */}
            <SupportLink />
            <LocaleSwitch />
            <ThemeToggle />
            <Navigation />
            {children}
            <MobileMenu />
            <Analytics />
            <Hotjar
              id={env.NEXT_PUBLIC_HOTJAR_ID}
              sv={env.NEXT_PUBLIC_HOTJAR_SV}
            />
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
