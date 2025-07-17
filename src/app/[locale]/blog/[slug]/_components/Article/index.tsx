"use client";
import { type GetArticleResponseBody } from "@/app/[locale]/articles/[slug]/route";
import axios, { type AxiosResponse } from "axios";
import clsx from "clsx";
import { type ReactNode, type RefObject, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import useScrollbarSize from "react-scrollbar-size";
import SyntaxHighlighter from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark-reasonable";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import useSWR, { type Fetcher } from "swr";
import { useResizeObserver } from "usehooks-ts";
import styles from "./style.module.css";

const fetcher: Fetcher = async (url: string) =>
  axios.get<GetArticleResponseBody, AxiosResponse>(url).then((res) => res.data);

type TableProps = {
  children?: ReactNode;
};

function Table({ children }: TableProps): React.JSX.Element {
  const ref = useRef<HTMLTableElement>(null);
  const { height = 0 } = useResizeObserver({
    ref: ref as RefObject<HTMLElement>,
  });
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

export default function Article({ slug }: ArticleProps): React.JSX.Element {
  const { data } = useSWR(`/articles/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });
  const { content, date, title } = useMemo(
    () =>
      (data as GetArticleResponseBody) || { content: "", date: "", title: "" },
    [data],
  );

  return (
    <div className={styles.wrapper}>
      <article className={clsx("markdown-body", styles.article)}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.date}>{date}</div>
        <div className={styles.spacer} />
        <ReactMarkdown
          components={{
            a: ({ children, ...props }) => {
              try {
                new URL(props.href ?? "");
                // If we don't get an error, then it's an absolute URL.

                props.target = "_blank";
                props.rel = "noopener noreferrer";
              } catch {
                // Relative URL - no processing needed
              }

              return <a {...props}>{children}</a>;
            },
            pre: ({ children }): ReactNode => {
              const child = children as React.ReactElement & {
                props: { children: string; className?: string };
              };
              const {
                props: { children: propChildren, className },
              } = child;
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
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
