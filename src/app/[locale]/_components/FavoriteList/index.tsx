import Image from "next/image";
import { type Locale } from "@/i18n/routing";
import { type FavoriteGenre, getFavorites } from "@/libs/favorites";
import styles from "./style.module.css";

export type FavoriteListProps = {
  genre: FavoriteGenre;
  heading: string;
  locale: Locale;
};

export default function FavoriteList({
  genre,
  heading,
  locale,
}: FavoriteListProps): React.JSX.Element {
  const items = getFavorites(genre, locale);

  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      {items.length > 0 ? (
        <ul className={styles.list}>
          {items.map(({ href, image, name, text }) => (
            <li className={styles.item} key={href}>
              <div className={styles.itemInner}>
                {/* 配信元の画像をそのまま表示する。自サイトの最適化を通すと複製とキャッシュが残る。 */}
                {image ? (
                  <Image
                    alt=""
                    className={styles.image}
                    height={200}
                    src={image}
                    unoptimized={true}
                    width={200}
                  />
                ) : null}
                <a
                  className={styles.name}
                  href={href}
                  rel="sponsored noopener noreferrer"
                  target="_blank"
                >
                  <h2 className={styles.title}>{name}</h2>
                </a>
                {text ? <p className={styles.text}>{text}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
