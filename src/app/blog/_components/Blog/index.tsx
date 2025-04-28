"use client";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import InfiniteScroll, { Props } from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { BareFetcher } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import styles from "./style.module.css";
import { GetArticlesResponseBody } from "@/app/articles/route";
import pageSize from "@/libs/pageSize";

const getKey: SWRInfiniteKeyLoader<GetArticlesResponseBody> = (
  pageIndex,
  previousPageData,
) =>
  previousPageData && !previousPageData.length
    ? null
    : `/articles?page=${pageIndex}`;
const fetcher: BareFetcher<GetArticlesResponseBody> = (url: string) =>
  axios
    .get<GetArticlesResponseBody, AxiosResponse<GetArticlesResponseBody>>(url)
    .then((res) => res.data);

export default function Blog(): JSX.Element {
  const { data, setSize } = useSWRInfinite<GetArticlesResponseBody>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );
  const articles = useMemo(() => data?.flat() || [], [data]);
  const items = useMemo(
    () =>
      articles.map(({ date, slug, text, title }, index) => (
        <Link href={slug} key={slug}>
          <div
            className={styles.vStack}
            style={{
              borderTop: index > 0 ? "1px solid var(--color-gray)" : undefined,
            }}
          >
            <h3 className={styles.heading}>{title}</h3>
            <div className={styles.textWrapper}>
              <div className={styles.text}>{text}</div>
            </div>
            <div className={styles.date}>{date}</div>
          </div>
        </Link>
      )),
    [articles],
  );
  const isEmpty = useMemo(() => data?.[0]?.length === 0, [data]);
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < pageSize);
  const next = useCallback<Props["next"]>(() => {
    // eslint-disable-next-line no-void
    void setSize((prevSize) => prevSize + 1);
  }, [setSize]);

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h2>WEB SERVICE</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <InfiniteScroll
            dataLength={items.length}
            hasMore={!isReachingEnd}
            loader={
              <div className={styles.loader}>
                <Oval
                  color="#bdc1c6"
                  height={48}
                  secondaryColor="#808080"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                  visible={true}
                  width={48}
                />
              </div>
            }
            next={next}
          >
            {items}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}
