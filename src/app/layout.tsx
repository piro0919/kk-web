// eslint-disable-next-line filenames/match-exported
import "@szhsin/react-menu/dist/core.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import env from "@/env";
import "github-markdown-css";
import getMetadata from "@/libs/getMetadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Analytics from "./_components/Analytics";
import Hotjar from "./_components/Hotjar";
import "./globals.css";
import Layout from "./_components/Layout";
import LogRocket from "./_components/LogRocket";

const jkg = localFont({
  display: "swap",
  fallback: ["sans-serif"],
  src: "./jkg.woff2",
});

export const metadata = getMetadata({ type: "website" });

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="ja">
      <body className={jkg.className}>
        <Layout>{children}</Layout>
        <Analytics />
        <Hotjar />
        <LogRocket />
        <ToastContainer
          autoClose={5000}
          closeOnClick={true}
          hideProgressBar={false}
          pauseOnHover={false}
          position="bottom-left"
          theme="dark"
        />
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId={env.GA_MEASUREMENT_ID} />
    </html>
  );
}
