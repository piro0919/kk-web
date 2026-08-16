"use client";
import { Link } from "@/i18n/navigation";
import pageSize from "@/libs/pageSize";
import { useLocale } from "next-intl";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

/** 下端の何画面ぶん手前で読み始めるか。画面の高さに対する比で持つので、
    縦に長い画面でも短い画面でも同じ体感になる。監視の余白と読み込み後の
    再判定で共有する。 */
const loadAhead = 2.5;
/** 読み込み済みの続き。記事から一覧へ戻ったとき、同じ高さで描き直すために持っておく。
    ページを再読み込みすると消える。 */
const cache = new Map<string, ArticleListItem[]>();
/** 離れるときのスクロール位置。ブラウザの復元は続きを描く前に走るので、自前で戻す。 */
const scrollCache = new Map<string, number>();

export default function ArticleList({
  external = false,
  heading,
  infinite = false,
  items,
}: ArticleListProps): React.JSX.Element {
  const locale = useLocale();
  const cacheKey = `${heading}-${locale}`;
  const [loaded, setLoaded] = useState<ArticleListItem[]>(
    () => cache.get(cacheKey) ?? [],
  );
  const [isReachingEnd, setIsReachingEnd] = useState(!infinite);
  const isLoadingRef = useRef(false);
  const pageRef = useRef(1 + loaded.length / pageSize);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;

    try {
      const prefix = locale === "en" ? "" : `/${locale}`;
      const response = await fetch(
        `${prefix}/articles?page=${pageRef.current}`,
      );
      const next = (await response.json()) as ArticleListItem[];

      pageRef.current += 1;

      setLoaded((prev) => {
        const merged = [...prev, ...next];

        cache.set(cacheKey, merged);

        return merged;
      });

      if (next.length < pageSize) {
        setIsReachingEnd(true);
      }
    } finally {
      // 途中で失敗しても閉じておく。閉じ忘れると二度と読めなくなる。
      isLoadingRef.current = false;
    }
  }, [cacheKey, locale]);

  useLayoutEffect(() => {
    const saved = scrollCache.get(cacheKey);

    if (typeof saved !== "number" || loaded.length === 0) return;

    // ブラウザや Next 側の復元があとから走るので、少しのあいだ位置を保つ。
    // 利用者が触ったらすぐやめる。
    const start = performance.now();

    let frame = 0;
    let isCancelled = false;

    const cancel = (): void => {
      isCancelled = true;
    };
    const hold = (): void => {
      if (isCancelled) return;

      window.scrollTo(0, saved);

      if (performance.now() - start < 800) {
        frame = requestAnimationFrame(hold);
      }
    };

    frame = requestAnimationFrame(hold);

    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);

    return (): void => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
    // 出入りのときだけでよいので、位置の変化は追わない。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

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
      { rootMargin: `${loadAhead * 100}% 0px` },
    );

    observer.observe(sentinel);

    return (): void => {
      observer.disconnect();
    };
  }, [isReachingEnd, loadMore]);

  // IntersectionObserver は交差の状態が変わったときにしか呼ばれない。
  // 1ページ読んでも番兵がまだ手前に居ると、そこで止まってしまうので、
  // 描き終えたあとに測り直して、必要ならもう1ページ読む。
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || isReachingEnd) return;

    const frame = requestAnimationFrame(() => {
      const { top } = sentinel.getBoundingClientRect();

      if (top - window.innerHeight < window.innerHeight * loadAhead) {
        void loadMore();
      }
    });

    return (): void => {
      cancelAnimationFrame(frame);
    };
    // loaded は本文で使わないが、描き直しの合図として要る。
  }, [isReachingEnd, loadMore, loaded]);

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
                <Link
                  onClick={(): void => {
                    // 戻ってきたときに同じ位置へ戻すため、離れる直前の位置を控える。
                    scrollCache.set(cacheKey, window.scrollY);
                  }}
                  className={styles.itemInner}
                  href={href}
                >
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
