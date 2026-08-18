"use client";
import { Fragment, useEffect } from "react";
import env from "@/env";

/**
 * Hotjar の記録。読み込みは最初の操作まで待ち、そこから 2.5 秒置く。
 * 直帰した人には一度も取りに行かないので、初期表示の邪魔をしない。
 */
export default function Hotjar(): React.JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    let isLoaded = false;

    const loadHotjar = async (): Promise<void> => {
      if (isLoaded) return;

      isLoaded = true;

      const { hotjar } = await import("react-hotjar");

      hotjar.initialize({
        id: parseInt(env.NEXT_PUBLIC_HOTJAR_ID, 10),
        sv: parseInt(env.NEXT_PUBLIC_HOTJAR_SV, 10),
      });
    };
    // 最初のクリック・スクロール・タッチで一度だけ動かす。
    const handleUserInteraction = (): void => {
      setTimeout(() => {
        void loadHotjar();
      }, 2500);

      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction, {
      passive: true,
    });
    document.addEventListener("scroll", handleUserInteraction, {
      passive: true,
    });
    document.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });

    return (): void => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  return <Fragment />;
}
