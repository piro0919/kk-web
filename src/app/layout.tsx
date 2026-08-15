// eslint-disable-next-line filenames/match-exported
import { type Metadata } from "next";
import { Righteous } from "next/font/google";
import localFont from "next/font/local";
import { type ReactNode } from "react";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import MobileMenu from "./_components/MobileMenu";
import Navigation from "./_components/Navigation";
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
  title: "kk-web",
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
