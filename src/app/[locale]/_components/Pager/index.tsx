import { Link } from "@/i18n/navigation";
import styles from "./style.module.css";

export type PagerProps = {
  /** 1ページ目の URL。2ページ目以降は末尾に /page/N を足す。 */
  basePath: string;
  current: number;
  total: number;
};

/** 現在地の前後と両端だけを残し、間を省略記号に畳む。
    25ページあっても並びが横に溢れないようにするため。 */
function visiblePages(current: number, total: number): (null | number)[] {
  const kept = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...kept]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) => {
    const previous = pages[index - 1];

    // 飛んでいるところにだけ省略記号を挟む。1つ飛びなら数字をそのまま出す。
    return previous !== undefined && page - previous > 1
      ? [null, page]
      : [page];
  });
}

function href(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

/** 記事一覧の頁送り。無限スクロールはクローラーが辿れないので、
    実際のリンクとしての導線をここで持つ。 */
export default function Pager({
  basePath,
  current,
  total,
}: PagerProps): null | React.JSX.Element {
  if (total <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className={styles.pager}>
      {current > 1 ? (
        <Link
          className={styles.step}
          href={href(basePath, current - 1)}
          rel="prev"
        >
          ‹ Prev
        </Link>
      ) : (
        <span className={styles.stepDisabled}>‹ Prev</span>
      )}
      <ul className={styles.list}>
        {visiblePages(current, total).map((page, index) =>
          page === null ? (
            <li aria-hidden="true" className={styles.gap} key={`gap-${index}`}>
              …
            </li>
          ) : (
            <li key={page}>
              {page === current ? (
                <span aria-current="page" className={styles.currentPage}>
                  {page}
                </span>
              ) : (
                <Link className={styles.page} href={href(basePath, page)}>
                  {page}
                </Link>
              )}
            </li>
          ),
        )}
      </ul>
      {current < total ? (
        <Link
          className={styles.step}
          href={href(basePath, current + 1)}
          rel="next"
        >
          Next ›
        </Link>
      ) : (
        <span className={styles.stepDisabled}>Next ›</span>
      )}
    </nav>
  );
}
