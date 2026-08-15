// eslint-disable-next-line filenames/match-exported
import getBaseUrl from "@/libs/getBaseUrl";
import {
  createPersonStructuredData,
  createWebSiteStructuredData,
  SITE_DESCRIPTION,
} from "@/libs/structuredData";
import { type Metadata } from "next";
import { Righteous } from "next/font/google";
import localFont from "next/font/local";
import { type ReactNode } from "react";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import MobileMenu from "./_components/MobileMenu";
import Navigation from "./_components/Navigation";
import StructuredData from "./_components/StructuredData";
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
    <html lang="ja">
      <body className={jkg.className}>
        <StructuredData data={createWebSiteStructuredData()} />
        <StructuredData data={createPersonStructuredData()} />
        <Background />
        <Frame />
        <div className={righteous.className}>
          <Navigation />
        </div>
        {children}
        <div className={righteous.className}>
          <MobileMenu />
        </div>
      </body>
    </html>
  );
}
