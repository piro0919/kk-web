// eslint-disable-next-line filenames/match-exported
import "@szhsin/react-menu/dist/core.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import StructuredData from "@/components/StructuredData";
import "github-markdown-css";
import { routing } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import {
  createPersonStructuredData,
  createWebSiteStructuredData,
} from "@/libs/structuredData";
import "react-toastify/dist/ReactToastify.css";
import zodSetup from "@/libs/zodSetup";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Script from "next/script";
import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Analytics from "./_components/Analytics";
import GoogleAnalytics from "./_components/GoogleAnalytics";
import Hotjar from "./_components/Hotjar";
import Layout from "./_components/Layout";
import LogRocket from "./_components/LogRocket";

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

const jkg = localFont({
  display: "swap",
  fallback: ["sans-serif"],
  src: "./jkg.woff2",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    type: "website",
  });
}

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps): Promise<React.JSX.Element> {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  zodSetup(locale as "en" | "ja");

  const websiteStructuredData = await createWebSiteStructuredData({
    locale: locale as "en" | "ja",
  });
  const personStructuredData = createPersonStructuredData();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <link href="https://kkweb.io" rel="canonical" />
        {/* Preconnect to external domains for performance */}
        <link href="https://www.googletagmanager.com" rel="preconnect" />
        <link href="https://www.google-analytics.com" rel="preconnect" />
        <link href="https://static.hotjar.com" rel="preconnect" />
        <link href="https://script.hotjar.com" rel="preconnect" />
        <link href="https://cdn.lr-in.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        {/* Preload critical resources */}
        <link
          as="font"
          crossOrigin=""
          href="/jkg.woff2"
          rel="preload"
          type="font/woff2"
        />
        <link
          as="image"
          href="/metan_00.avif"
          rel="preload"
          type="image/avif"
        />
        <link
          as="image"
          href="/metan_00.webp"
          rel="preload"
          type="image/webp"
        />
        {/* DNS prefetch for other domains */}
        <link href="https://vitals.vercel-insights.com" rel="dns-prefetch" />
      </head>
      <body className={jkg.className}>
        <StructuredData data={websiteStructuredData} />
        <StructuredData data={personStructuredData} />
        <NextIntlClientProvider>
          <ThemeProvider defaultTheme="dark" enableSystem={false}>
            <Layout>{children}</Layout>
            <ToastContainer
              autoClose={5000}
              closeOnClick={true}
              hideProgressBar={false}
              pauseOnHover={false}
              position="bottom-left"
              theme="dark"
            />
            <Analytics />
            <Hotjar />
            <LogRocket />
            <GoogleAnalytics />
            <SpeedInsights />
          </ThemeProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === "production" ? (
          <Script
            data-website-id="9dc0884b-8e4f-4127-a2fb-48c432a79fe3"
            defer={true}
            src="/stats/script.js"
          />
        ) : null}
      </body>
    </html>
  );
}
