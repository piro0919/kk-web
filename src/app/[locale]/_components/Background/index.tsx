"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

// 4×4 の1ブロック。行と列の両方で2キャラが入れ違いになるよう市松に並べる。
// ブロックの幅・高さがともに偶数なので、ブロックをまたいでも市松が続く。
const TILE_IMAGES = [
  "/tsumugi_00.png",
  "/metan_00.png",
  "/tsumugi_04.png",
  "/metan_02.png",
  "/metan_04.png",
  "/tsumugi_08.png",
  "/metan_06.png",
  "/tsumugi_12.png",
  "/tsumugi_16.png",
  "/metan_08.png",
  "/tsumugi_20.png",
  "/metan_10.png",
  "/metan_12.png",
  "/tsumugi_24.png",
  "/metan_13.png",
  "/tsumugi_27.png",
];
// 4×4 ブロックの一辺。画面幅によらず固定なので、キャラの大きさはどこでも同じ。
const BLOCK_SIZE = 376;

export default function Background(): null | React.JSX.Element {
  const [{ columns, rows }, setGrid] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    const measure = (): void => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      setGrid({
        columns: Math.ceil(width / BLOCK_SIZE) + 1,
        rows: Math.ceil(height / BLOCK_SIZE) + 1,
      });
    };

    measure();

    window.addEventListener("resize", measure);

    return (): void => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (columns === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div
        style={
          {
            "--block-size": `${BLOCK_SIZE}px`,
            "--columns": columns,
          } as React.CSSProperties
        }
        className={styles.tiles}
      >
        {Array.from(
          { length: columns * rows },
          (_, blockIndex) => `block-${blockIndex}`,
        ).map((blockKey) => (
          <div className={styles.block} key={blockKey}>
            {TILE_IMAGES.map((src) => (
              <div className={styles.tile} key={src}>
                <Image alt="" fill={true} quality={75} src={src} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.pattern} />
    </div>
  );
}
