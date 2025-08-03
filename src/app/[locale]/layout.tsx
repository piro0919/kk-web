// eslint-disable-next-line filenames/match-exported
import "@szhsin/react-menu/dist/core.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import env from "@/env";
import "github-markdown-css";
import { routing } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import "react-toastify/dist/ReactToastify.css";
import zodSetup from "@/libs/zodSetup";
import { GoogleAnalytics } from "@next/third-parties/google";
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

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={jkg.className}>
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
        <GoogleAnalytics gaId={env.GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
