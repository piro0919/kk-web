import clsx from "clsx";
import { Noto_Sans as NotoSans } from "next/font/google";
import Image from "next/image";
import styles from "./style.module.css";

const notoSans = NotoSans({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
  weight: "700",
});

export default function App(): React.JSX.Element {
  // 日替わりで2キャラを入れ替える。日付から決めるので描画のたびにぶれない。
  const date = new Date().getDate();
  const isTsumugi = date % 2 > 0;
  const index = date % (isTsumugi ? 28 : 14);
  const suffix = index.toString().padStart(2, "0");

  return (
    <div className={styles.wrapper}>
      <div className={styles.srOnly}>
        <h1>kk-web</h1>
      </div>
      <div className={styles.container}>
        <div
          className={clsx(
            styles.bubble,
            isTsumugi ? styles.left : styles.right,
          )}
        >
          <Image
            alt=""
            fill={true}
            quality={100}
            src="/bubble.png"
            style={isTsumugi ? undefined : { scale: "-1 1" }}
          />
          <div className={clsx(notoSans.className, styles.text)}>kk-web</div>
        </div>
        {isTsumugi ? (
          <div className={styles.tsumugi}>
            <Image
              alt="春日部つむぎ"
              fill={true}
              priority={true}
              quality={100}
              sizes="(width < 768px) 50vw, 25vw"
              src={`/tsumugi_${suffix}.png`}
            />
          </div>
        ) : (
          <div className={styles.metan}>
            <Image
              alt="四国めたん"
              fill={true}
              priority={true}
              quality={100}
              sizes="(width < 768px) 50vw, 25vw"
              src={`/metan_${suffix}.png`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
