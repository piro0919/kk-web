// eslint-disable-next-line filenames/match-exported
import "@szhsin/react-menu/dist/core.css";
import "@szhsin/react-menu/dist/theme-dark.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "github-markdown-css";
import localFont from "next/font/local";
// import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Analytics from "./_components/Analytics";
import GoogleAnalytics from "./_components/GoogleAnalytics";
import Hotjar from "./_components/Hotjar";
import Layout from "./_components/Layout";
import LogRocket from "./_components/LogRocket";
import "./globals.css";
import getMetadata from "@/libs/getMetadata";

const jkg = localFont({
  fallback: ["sans-serif"],
  src: [{ path: "./jkg.ttf" }, { path: "./jkg.woff" }, { path: "./jkg.woff2" }],
});

export const metadata = getMetadata({ type: "website" });

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="ja">
      <body className={jkg.className}>
        <Layout>{children}</Layout>
        <Analytics />
        <GoogleAnalytics />
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
        {/* <NextTopLoader
          color="#234794"
          height={2}
          shadow={false}
          showSpinner={false}
        /> */}
        <SpeedInsights />
      </body>
    </html>
  );
}
