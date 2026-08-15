// eslint-disable-next-line filenames/match-exported
import { type Metadata } from "next";
import localFont from "next/font/local";
import { type ReactNode } from "react";
import Background from "./_components/Background";
import Frame from "./_components/Frame";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
