"use client";
import axios, { AxiosResponse } from "axios";
import { ReactNode, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import useScrollbarSize from "react-scrollbar-size";
import SyntaxHighlighter from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark-reasonable";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import useSWR, { Fetcher } from "swr";
import { useElementSize } from "usehooks-ts";
import styles from "./style.module.css";
import { GetArticleResponseBody } from "@/app/articles/[slug]/route";

const fetcher: Fetcher<GetArticleResponseBody> = (url: string) =>
  axios
    .get<GetArticleResponseBody, AxiosResponse<GetArticleResponseBody>>(url)
    .then((res) => res.data);

type TableProps = {
  children: ReactNode;
};

function Table({ children }: TableProps): JSX.Element {
  const [ref, { height }] = useElementSize();
  const { height: scrollbarHeight } = useScrollbarSize();

  return (
    <div
      style={{
        height: height + scrollbarHeight,
        overflow: "auto hidden",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute" }}>
        <table ref={ref}>{children}</table>
      </div>
    </div>
  );
}

export type ArticleProps = {
  slug: string;
};

export default function Article({ slug }: ArticleProps): JSX.Element {
  const { data } = useSWR(`/articles/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });
  const { content, date, title } = useMemo(
    () => data || { content: "", date: "", title: "" },
    [data],
  );

  return (
    <div className={styles.wrapper}>
      <article className={`markdown-body ${styles.article}`}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.date}>{date}</div>
        <div className={styles.spacer} />
        <ReactMarkdown
          components={{
            pre: ({ children }): ReactNode => {
              const preChildren = children[0];

              if (!preChildren) {
                return null;
              }

              const {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                props: { children: propChildren, className },
              } = preChildren;
              const tmpLanguage =
                typeof className === "string"
                  ? className.replace("language-", "")
                  : undefined;
              const language = SyntaxHighlighter.supportedLanguages.find(
                (supportedLanguage) => tmpLanguage === supportedLanguage,
              );

              return (
                <SyntaxHighlighter
                  language={language || "typescript"}
                  style={style}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {String(propChildren)}
                </SyntaxHighlighter>
              );
            },
            table: Table,
          }}
          linkTarget="_blank"
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
