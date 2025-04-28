"use client";
import i18next from "i18next";
import { ReactNode } from "react";
import useMeasure from "react-use-measure";
import { useScrollYPosition } from "react-use-scroll-position";
import { useWindowSize } from "usehooks-ts";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/ja/zod.json";
import Footer from "../Footer";
import Header from "../Header";
import MobileMenu from "../MobileMenu";
import Navigation from "../Navigation";
import styles from "./style.module.css";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18next.init({
  lng: "ja",
  resources: {
    ja: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { height: windowHeight } = useWindowSize();
  const scrollY = useScrollYPosition();
  const [ref, { height }] = useMeasure();

  return (
    <div>
      <div className={styles.srOnly}>
        <h1>kk-web</h1>
      </div>
      <div
        className={styles.grid}
        style={{
          minHeight: windowHeight || "100dvh",
        }}
      >
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
        className={styles.navigation}
        style={{
          top: scrollY > height ? height : 0,
        }}
      >
        <div ref={ref}>
          <Navigation />
        </div>
      </div>
    </div>
  );
}
