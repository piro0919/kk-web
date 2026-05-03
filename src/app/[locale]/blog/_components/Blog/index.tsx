"use client";
import { type GetArticlesResponseBody } from "@/app/[locale]/articles/route";
import { Link } from "@/i18n/navigation";
import pageSize from "@/libs/pageSize";
import axios, { type AxiosResponse } from "axios";
import { useCallback, useMemo } from "react";
import InfiniteScroll, { type Props } from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { type BareFetcher } from "swr";
import useSWRInfinite, { type SWRInfiniteKeyLoader } from "swr/infinite";
import styles from "./style.module.css";
import type { Fc2Article } from "@/libs/getFc2Articles";

const getKey: SWRInfiniteKeyLoader<GetArticlesResponseBody> = (
  pageIndex,
  previousPageData,
) =>
  previousPageData && !previousPageData.length
    ? null
    : `/articles?page=${pageIndex}`;
const fetcher: BareFetcher<GetArticlesResponseBody> = async (url: string) =>
  axios
    .get<GetArticlesResponseBody, AxiosResponse<GetArticlesResponseBody>>(url)
    .then((res) => res.data);

type Props2 = {
  fc2Articles: Fc2Article[];
};

export default function Blog({ fc2Articles }: Props2): React.JSX.Element {
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
      articles.map(({ date, slug, text, title }) => (
        <Link className={styles.link} href={slug} key={slug}>
          <div className={styles.vStack}>
            <h2 className={styles.heading}>{title}</h2>
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
    void setSize((prevSize) => prevSize + 1);
  }, [setSize]);
  const fc2Items = useMemo(
    () =>
      fc2Articles.map(({ date, text, title, url }) => (
        <a
          className={styles.link}
          href={url}
          key={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className={styles.vStack}>
            <h2 className={styles.heading}>{title}</h2>
            {text && (
              <div className={styles.textWrapper}>
                <div className={styles.text}>{text}</div>
              </div>
            )}
            <div className={styles.date}>{date}</div>
          </div>
        </a>
      )),
    [fc2Articles],
  );

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h1>BLOG</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <InfiniteScroll
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
            dataLength={items.length}
            hasMore={!isReachingEnd}
            next={next}
          >
            {items}
            {isReachingEnd && fc2Items}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
}
