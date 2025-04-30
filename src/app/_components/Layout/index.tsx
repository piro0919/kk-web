"use client";
import zodSetup from "@/libs/zodSetup";
import { ProgressProvider } from "@bprogress/next/app";
import { type ReactNode } from "react";
import useMeasure from "react-use-measure";
import { useScrollYPosition } from "react-use-scroll-position";
import { useWindowSize } from "usehooks-ts";
import Footer from "../Footer";
import Header from "../Header";
import MobileMenu from "../MobileMenu";
import Navigation from "../Navigation";
import styles from "./style.module.css";

zodSetup();

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const { height: windowHeight } = useWindowSize();
  const scrollY = useScrollYPosition();
  const [ref, { height }] = useMeasure();

  return (
    <ProgressProvider
      color="#234794"
      height="2px"
      options={{ showSpinner: false }}
      shallowRouting={true}
    >
      <div className={styles.srOnly}>
        <h1>kk-web</h1>
      </div>
      <div
        style={{
          minHeight: windowHeight || "100dvh",
        }}
        className={styles.grid}
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
