"use client";
import { Link } from "@/i18n/navigation";
import pageSize from "@/libs/pageSize";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
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
  /** 立てると、下端に着いたときに続きを読み込む。 */
  infinite?: boolean;
  items: ArticleListItem[];
};

export default function ArticleList({
  external = false,
  heading,
  infinite = false,
  items,
}: ArticleListProps): React.JSX.Element {
  const locale = useLocale();
  const [loaded, setLoaded] = useState<ArticleListItem[]>([]);
  const [isReachingEnd, setIsReachingEnd] = useState(!infinite);
  const isLoadingRef = useRef(false);
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;

    const prefix = locale === "en" ? "" : `/${locale}`;
    const response = await fetch(`${prefix}/articles?page=${pageRef.current}`);
    const next = (await response.json()) as ArticleListItem[];

    pageRef.current += 1;

    setLoaded((prev) => [...prev, ...next]);

    if (next.length < pageSize) {
      setIsReachingEnd(true);
    }

    isLoadingRef.current = false;
  }, [locale]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || isReachingEnd) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(({ isIntersecting }) => isIntersecting)) {
          void loadMore();
        }
      },
      // 下端に着く前に読み始める。
      { rootMargin: "1200px 0px" },
    );

    observer.observe(sentinel);

    return (): void => {
      observer.disconnect();
    };
  }, [isReachingEnd, loadMore]);

  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <ul className={styles.list}>
        {[...items, ...loaded].map(({ date, href, text, title }) => {
          const inner = (
            <>
              <div className={styles.titleBlock}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.date}>{date}</p>
              </div>
              <p className={styles.text}>{text}</p>
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
      {isReachingEnd ? null : (
        <div className={styles.sentinel} ref={sentinelRef} />
      )}
    </>
  );
}
