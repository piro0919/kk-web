import getBaseUrl from "@/libs/getBaseUrl";
import getMetadata from "@/libs/getMetadata";
import { promises as fs } from "fs";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import parseMD from "parse-md";
import path from "path";
import Article from "./_components/Article";
import SWRProvider from "./swr-provider";

type GetArticleParams = {
  slug: string;
};

type GetArticleData = {
  content: string;
  date: string;
  title: string;
};

async function getArticle({ slug }: GetArticleParams): Promise<GetArticleData> {
  const locale = await getLocale();
  const markdownPath = path.join(
    process.cwd(),
    "/src/markdown-pages",
    locale,
    `${slug}.md`,
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileContents = await fs.readFile(markdownPath, "utf8");
  const { content, metadata } = parseMD(fileContents);
  const { date, title } = metadata as {
    date: string;
    slug: string;
    title: string;
  };

  return { content, date, title };
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { content, title } = await getArticle({ slug });
  const locale = await getLocale();
  const baseUrl = getBaseUrl();

  return getMetadata({
    description: content.slice(0, 300),
    imageUrl: `${baseUrl}/${locale}/articles/${slug}/image`,
    locale: locale as "en" | "ja",
    path: `/blog/${slug}`,
    subTitle: title,
  });
}

// 24 時間ごと
export const revalidate = 86400;

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params;

  try {
    const article = await getArticle({ slug });

    return (
      <SWRProvider fallback={{ [`/articles/${slug}`]: article }}>
        <Article slug={slug} />
      </SWRProvider>
    );
  } catch (e) {
    const error = e as Error;

    if (
      error.message.includes("no such file or directory") &&
      locale === "en"
    ) {
      notFound();
    }

    throw error;
  }
}
