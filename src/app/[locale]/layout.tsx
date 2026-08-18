// eslint-disable-next-line filenames/match-exported
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Righteous, Zen_Kaku_Gothic_New as TitleFont } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Script from "next/script";
import { type ReactNode } from "react";
import { routing } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import {
  createPersonStructuredData,
  createWebSiteStructuredData,
} from "@/libs/structuredData";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import LocaleSwitch from "./_components/LocaleSwitch";
import MobileMenu from "./_components/MobileMenu";
import Navigation from "./_components/Navigation";
import StructuredData from "./_components/StructuredData";
import SupportLink from "./_components/SupportLink";
import ThemeToggle from "./_components/ThemeToggle";
import "github-markdown-css";
// github-markdown-css の配色を data-theme に紐づけ直す。読み込む順が要る。
import "./markdown-theme.css";
import "./globals.css";

// 欧文の見出しとナビゲーション用。708 と同じ書体。
// CSS から var(--font-righteous) で参照する。
const righteous = Righteous({
  subsets: ["latin"],
  variable: "--font-righteous",
  weight: "400",
});
// 作品名用。日本語もラテン文字も持ち、太字があるので線を足さずに済む。
// 日本語の字は unicode-range で細かく配られる。next/font に japanese の
// サブセット指定が無いので、subsets を書かず preload を切る。
const titleFont = TitleFont({
  preload: false,
  variable: "--font-title",
  weight: "700",
});
const jkg = localFont({
  display: "swap",
  fallback: ["sans-serif"],
  src: "./jkg.woff2",
  // 太さを明示しないとブラウザが擬似ボールドを作らない。
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
      <body
        className={`${jkg.className} ${righteous.variable} ${titleFont.variable}`}
      >
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
