import clsx from "clsx";
import { getDate } from "date-fns";
import { M_PLUS_1_Code as MPLUS1Code } from "next/font/google";
import Image from "next/image";
import styles from "./style.module.css";

const mPLUS1Code = MPLUS1Code({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
  weight: "700",
});

export default function Error(): React.JSX.Element {
  const date = getDate(new Date());
  const isTsumugi = date % 2 === 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.srOnly}>
        <h1>Error</h1>
      </div>
      <div className={styles.container}>
        <div
          className={clsx(
            styles.bubble,
            isTsumugi ? styles.left : styles.right,
          )}
        >
          <Image
            alt="kk-web"
            fill={true}
            quality={100}
            src="/bubble.png"
            style={isTsumugi ? undefined : { scale: "-1 1" }}
          />
          <div className={clsx(mPLUS1Code.className, styles.text)}>
            Sorry...
          </div>
        </div>
        {isTsumugi ? (
          <div className={styles.tsumugi}>
            <Image
              alt="kk-web"
              fill={true}
              quality={100}
              src="/tsumugi_26.png"
            />
          </div>
        ) : (
          <div className={styles.metan}>
            <Image alt="kk-web" fill={true} quality={100} src="/metan_04.png" />
          </div>
        )}
      </div>
    </div>
  );
}
