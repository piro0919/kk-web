import { routing } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import pageSize from "@/libs/pageSize";
import { promises as fs } from "fs";
import removeMarkdown from "markdown-to-text";
import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import parseMD from "parse-md";
import path from "path";
import { use } from "react";
import Blog from "./_components/Blog";
import SWRProvider from "./swr-provider";

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/blog",
    subTitle: "BLOG",
  });
}

// 24 時間ごと
export const revalidate = 86400;

type Article = {
  date: string;
  slug: string;
  text: string;
  title: string;
};

type GetArticlesParams = {
  locale: string;
};

type GetArticlesData = Article[];

async function getArticles({
  locale,
}: GetArticlesParams): Promise<GetArticlesData> {
  const markdownPagesPath = path.join(
    process.cwd(),
    "/src/markdown-pages",
    locale,
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const filenames = await fs.readdir(markdownPagesPath);
  const articles = await Promise.all(
    filenames
      .reverse()
      .filter((_, index) => index < pageSize)
      .map(async (filename) => {
        const markdownPagePath = path.join(markdownPagesPath, filename);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const fileContents = await fs.readFile(markdownPagePath, "utf8");
        const { content, metadata } = parseMD(fileContents);
        const { date, slug, title } = metadata as {
          date: string;
          slug: string;
          title: string;
        };

        return {
          date,
          slug,
          text: removeMarkdown(content.slice(0, 200)),
          title,
        };
      }),
  );

  return articles;
}

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}): React.JSX.Element {
  const { locale } = use(params);

  setRequestLocale(locale);

  const articles = use(getArticles({ locale }));

  return (
    <SWRProvider fallbackData={articles}>
      <Blog />
    </SWRProvider>
  );
}
