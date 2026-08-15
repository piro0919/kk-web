import Link from "next/link";
import styles from "./style.module.css";

export type ArticleListItem = {
  date: string;
  href: string;
  text: string;
  title: string;
};

export type ArticleListProps = {
  /** 外部サイトへ飛ばす一覧かどうか。NOTE のように別ドメインへ出る場合に立てる。 */
  external?: boolean;
  heading: string;
  items: ArticleListItem[];
};

export default function ArticleList({
  external = false,
  heading,
  items,
}: ArticleListProps): React.JSX.Element {
  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <ul className={styles.list}>
        {items.map(({ date, href, text, title }) => {
          const inner = (
            <>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.text}>{text}</p>
              <p className={styles.date}>{date}</p>
            </>
          );

          return (
            <li className={styles.item} key={href}>
              {external ? (
                <a
                  className={styles.itemInner}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {inner}
                </a>
              ) : (
                <Link className={styles.itemInner} href={href}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
