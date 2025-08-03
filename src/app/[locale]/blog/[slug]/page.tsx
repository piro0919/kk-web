import getBaseUrl from "@/libs/getBaseUrl";
import getMetadata from "@/libs/getMetadata";
import { promises as fs } from "fs";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import parseMD from "parse-md";
import path from "path";
import { use } from "react";
import Article from "./_components/Article";
import SWRProvider from "./swr-provider";

type GetArticleParams = {
  locale: string;
  slug: string;
};

type GetArticleData = {
  content: string;
  date: string;
  title: string;
};

type ArticleMetadata = {
  date: string;
  slug: string;
  title: string;
};

async function getLatestArticles(
  locale: string,
  limit: number = 10,
): Promise<string[]> {
  const localeDir = path.join(process.cwd(), "/src/markdown-pages", locale);

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const files = await fs.readdir(localeDir);
    const articles: { date: Date; slug: string }[] = [];

    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const slug = file.replace(".md", "");
      const filePath = path.join(localeDir, file);

      try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const fileContents = await fs.readFile(filePath, "utf8");
        const { metadata } = parseMD(fileContents);
        const { date } = metadata as ArticleMetadata;

        articles.push({ date: new Date(date), slug });
      } catch {
        continue;
      }
    }

    return articles
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit)
      .map((article) => article.slug);
  } catch {
    return [];
  }
}

async function getArticle({
  locale,
  slug,
}: GetArticleParams): Promise<GetArticleData> {
  try {
    const markdownPath = path.join(
      process.cwd(),
      "/src/markdown-pages",
      locale,
      `${slug}.md`,
    );
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileContents = await fs.readFile(markdownPath, "utf8");
    const { content, metadata } = parseMD(fileContents);
    const { date, title } = metadata as ArticleMetadata;

    return { content, date, title };
  } catch {
    notFound();
  }
}

// 24時間ごとにISR
export const revalidate = 86400;

// 最新10件のみを事前生成
export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const locales = ["en", "ja"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const latestSlugs = await getLatestArticles(locale, 10);

    params.push(...latestSlugs.map((slug) => ({ locale, slug })));
  }

  return params;
}

// アクセス時に動的生成を許可
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const { content, title } = await getArticle({ locale, slug });
    const baseUrl = getBaseUrl();

    return getMetadata({
      description: content.slice(0, 300),
      imageUrl: `${baseUrl}/${locale}/articles/${slug}/image`,
      locale: locale as "en" | "ja",
      path: `/blog/${slug}`,
      subTitle: title,
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return getMetadata({
        locale: locale as "en" | "ja",
        path: `/blog/${slug}`,
        subTitle: "Article Not Found",
      });
    }

    throw error;
  }
}

export default function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): React.JSX.Element {
  const { locale, slug } = use(params);
  const article = use(getArticle({ locale, slug }));

  return (
    <SWRProvider fallback={{ [`/articles/${slug}`]: article }}>
      <Article slug={slug} />
    </SWRProvider>
  );
}
