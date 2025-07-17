import clsx from "clsx";
import { getDate } from "date-fns";
import { Noto_Sans as NotoSans } from "next/font/google";
import Image from "next/image";
import styles from "./style.module.css";

const notoSans = NotoSans({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
  weight: "700",
});

export default function NotFound(): React.JSX.Element {
  const today = new Date();
  const date = getDate(today);
  const isTsumugi = !(date % 2 > 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.srOnly}>
        <h1>404</h1>
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
          <div className={clsx(notoSans.className, styles.text)}>
            not found...
          </div>
        </div>
        {isTsumugi ? (
          <div className={styles.tsumugi}>
            <Image
              alt="春日部つむぎ"
              fill={true}
              quality={100}
              src="/tsumugi_26.png"
            />
          </div>
        ) : (
          <div className={styles.metan}>
            <Image
              alt="四国めたん"
              fill={true}
              quality={100}
              src="/metan_04.png"
            />
          </div>
        )}
      </div>
    </div>
  );
}
