"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
// タイル1枚の表示幅。sizes を書かないと画面幅ぶんの絵を取りに行く。
const TILE_SIZE = BLOCK_SIZE / 4;
// タイル1枚ぶんの間隔。16枚で 1.5 秒かけて出そろう。
const STEP = 0.1;

/** 0〜15 をばらけさせた並び。タイルが1枚ずつ現れる順番になる。 */
function shuffleOrder(): number[] {
  const pool = TILE_IMAGES.map((_, index) => index);
  const order: number[] = [];

  while (pool.length > 0) {
    const picked = pool.splice(Math.floor(Math.random() * pool.length), 1);

    order.push(...picked);
  }

  return order;
}

export default function Background(): null | React.JSX.Element {
  const [{ columns, rows }, setGrid] = useState({ columns: 0, rows: 0 });
  const blockCount = columns * rows;
  // ブロックごとに別の順番で出す。画面全体が同じ動きに揃うのを避ける。
  const orders = useMemo(
    () => Array.from({ length: blockCount }, () => shuffleOrder()),
    [blockCount],
  );

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
        {orders.map((order, blockIndex) => (
          <div className={styles.block} key={`block-${blockIndex}`}>
            {TILE_IMAGES.map((src, tileIndex) => (
              <div
                style={{
                  animationDelay: `${STEP * order.indexOf(tileIndex)}s`,
                }}
                className={styles.tile}
                key={src}
              >
                <Image
                  alt=""
                  fill={true}
                  quality={75}
                  sizes={`${TILE_SIZE}px`}
                  src={src}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
