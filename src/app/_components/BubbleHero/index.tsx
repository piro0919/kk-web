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

export type BubbleHeroProps = {
  /** 画面読み上げ用の見出し。 */
  heading: string;
  /** つむぎなら吹き出しが左上、めたんなら右上に付く。 */
  isTsumugi: boolean;
  priority?: boolean;
  src: string;
  text: string;
};

export default function BubbleHero({
  heading,
  isTsumugi,
  priority = false,
  src,
  text,
}: BubbleHeroProps): React.JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.srOnly}>
        <h1>{heading}</h1>
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
          <div className={clsx(notoSans.className, styles.text)}>{text}</div>
        </div>
        <div className={isTsumugi ? styles.tsumugi : styles.metan}>
          <Image
            alt={isTsumugi ? "春日部つむぎ" : "四国めたん"}
            fill={true}
            priority={priority}
            quality={100}
            sizes="(width < 768px) 50vw, 25vw"
            src={src}
          />
        </div>
      </div>
    </div>
  );
}
