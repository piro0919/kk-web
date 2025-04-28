"use client";
import { Box, Flex, Heading, Spacer } from "@kuma-ui/core";
import axios, { AxiosResponse } from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactNode, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import useScrollbarSize from "react-scrollbar-size";
import SyntaxHighlighter from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark-reasonable";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import useSWR, { Fetcher } from "swr";
import { useElementSize } from "usehooks-ts";
import { GetArticleResponseBody } from "@/app/articles/[slug]/route";
import getBreakpoints from "@/libs/getBreakpoints";

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
    <Box
      height={height + scrollbarHeight}
      overflow="auto hidden"
      position="relative"
    >
      <Box position="absolute">
        <table ref={ref}>{children}</table>
      </Box>
    </Box>
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
    <Flex alignItems="center" height="100%" justify="center">
      <Box
        as="article"
        bg="inherit"
        className="markdown-body"
        color="inherit"
        fontFamily="inherit"
        fontSize="inherit"
        pb={48}
        pt={24}
        px={getBreakpoints({
          lg: 24,
          sm: 12,
        })}
        width="min(960px, 100%)"
      >
        <Heading>{title}</Heading>
        <Box color="colors.gray">{date}</Box>
        <Spacer size={36} />
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
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      </Box>
    </Flex>
  );
}
