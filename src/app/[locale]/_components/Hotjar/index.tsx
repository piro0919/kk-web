"use client";
import { Fragment, useEffect } from "react";

export type HotjarProps = {
  id: string;
  sv: string;
};

/**
 * Hotjar の記録。読み込みは最初の操作まで待ち、そこから 2.5 秒置く。
 * 直帰した人には一度も取りに行かないので、初期表示の邪魔をしない。
 *
 * 番号は受け取る。ここで @/env を読むと、その検証に使っている zod ごと
 * 全ページの JS に載る。この部品は額縁と同じくどのページにも居るので、
 * 読む場所を server 側へ寄せておく。
 */
export default function Hotjar({ id, sv }: HotjarProps): React.JSX.Element {
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
        id: parseInt(id, 10),
        sv: parseInt(sv, 10),
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
  }, [id, sv]);

  return <Fragment />;
}
