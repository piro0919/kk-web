import dayjs from "dayjs";
import { M_PLUS_1_Code as MPLUS1Code } from "next/font/google";
import Image from "next/image";
import styles from "./style.module.css";

const mPLUS1Code = MPLUS1Code({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
  weight: "700",
});

export default function App(): JSX.Element {
  const date = dayjs().date();
  const isTsumugi = date % 2 > 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div
          className={`${styles.bubble} ${
            isTsumugi ? styles.left : styles.right
          }`}
        >
          <Image
            alt="kk-web"
            fill={true}
            quality={100}
            src="/bubble.webp"
            style={isTsumugi ? undefined : { scale: "-1 1" }}
          />
          <div className={`${mPLUS1Code.className} ${styles.text}`}>
            ケーケーウェブ
          </div>
        </div>
        {isTsumugi ? (
          <div className={styles.tsumugi}>
            <Image alt="kk-web" fill={true} quality={100} src="/tsumugi.webp" />
          </div>
        ) : (
          <div className={styles.metan}>
            <Image alt="kk-web" fill={true} quality={100} src="/metan.webp" />
          </div>
        )}
      </div>
    </div>
  );
}
