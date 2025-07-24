"use client";
import zodSetup from "@/libs/zodSetup";
import { ProgressProvider } from "@bprogress/next/app";
import { useLocale } from "next-intl";
import { type ReactNode, useEffect } from "react";
import useMeasure from "react-use-measure";
import { useScrollYPosition } from "react-use-scroll-position";
import useShowWindowSize from "use-show-window-size";
import Footer from "../Footer";
import Header from "../Header";
import MobileMenu from "../MobileMenu";
import Navigation from "../Navigation";
import styles from "./style.module.css";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const scrollY = useScrollYPosition();
  const [ref, { height }] = useMeasure();
  const locale = useLocale();

  useEffect(() => {
    zodSetup(locale as "en" | "ja");
  }, [locale]);

  useShowWindowSize({
    disable: process.env.NODE_ENV === "production",
  });

  return (
    <ProgressProvider
      color="#234794"
      height="2px"
      options={{ showSpinner: false }}
      shallowRouting={true}
    >
      <div className={styles.grid}>
        <div className={styles.header}>
          <Header />
        </div>
        <main>{children}</main>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
      <div className={styles.mobileMenu}>
        <MobileMenu />
      </div>
      <div
        style={{
          top: scrollY > height ? height : 0,
        }}
        className={styles.navigation}
      >
        <div ref={ref}>
          <Navigation />
        </div>
      </div>
    </ProgressProvider>
  );
}
