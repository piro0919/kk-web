"use client";
import { Fragment, useEffect } from "react";

// 指の小さな揺れで出たり消えたりしないよう、この量を超えて動いたら判定する。
const THRESHOLD = 8;

/**
 * 下へスクロールしたらナビを隠し、上へスクロールしたら戻す。
 * 隠すかどうかは html の data-scroll-hidden に書くだけで、
 * 何をどう隠すかは各部品の CSS が決める。
 */
export default function HideOnScroll(): React.JSX.Element {
  useEffect(() => {
    const root = document.documentElement;

    let lastY = window.scrollY;
    let frame = 0;
    let isHidden = false;

    // html の属性は書くたびにページ全体の見た目を計算し直させるので、
    // 同じ値の書き直しはしない。スクロール中に何度も書くと引っかかる。
    const setHidden = (next: boolean): void => {
      if (next === isHidden) return;

      isHidden = next;

      if (next) {
        root.dataset.scrollHidden = "true";
      } else {
        delete root.dataset.scrollHidden;
      }
    };
    const update = (): void => {
      frame = 0;

      // iOS は下端で行き過ぎて跳ね返る。戻る動きを上へのスクロールと
      // 取り違えないよう、下端より先は下端として扱う。
      const y = Math.min(
        window.scrollY,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      // 上端では必ず出す。ナビは上端から 7px 動くと貼り付くので、
      // 上端の余裕を広く取ると、貼り付いて止まった後に遅れて隠れ始め、
      // 2段階で動いて見える。
      if (y <= 0) {
        setHidden(false);
        lastY = y;

        return;
      }

      if (Math.abs(y - lastY) < THRESHOLD) return;

      setHidden(y > lastY);
      lastY = y;
    };
    const handleScroll = (): void => {
      if (frame) return;

      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return (): void => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
      delete root.dataset.scrollHidden;
    };
  }, []);

  return <Fragment />;
}
