import getBaseUrl from "@/libs/getBaseUrl";
import getMetadata from "@/libs/getMetadata";
import { promises as fs } from "fs";
import { type Metadata } from "next";
import parseMD from "parse-md";
import path from "path";
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

async function getArticle({
  locale,
  slug,
}: GetArticleParams): Promise<GetArticleData> {
  const markdownPath = path.join(
    process.cwd(),
    "/src/markdown-pages",
    locale,
    `${slug}.md`,
  );
  // generateStaticParamsで存在が保証されているファイルのみアクセスされる
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

// 事前に存在するarticleのみを静的生成対象として定義
export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const articlesDir = path.join(process.cwd(), "/src/markdown-pages");
  const locales = ["en", "ja"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const localeDir = path.join(articlesDir, locale);

    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const files = await fs.readdir(localeDir);
      const slugs = files
        .filter((file) => file.endsWith(".md"))
        .map((file) => file.replace(".md", ""));

      params.push(...slugs.map((slug) => ({ locale, slug })));
    } catch {
      // ディレクトリが存在しない場合はスキップ
      // eslint-disable-next-line no-console
      console.warn(`Articles directory not found for locale: ${locale}`);
    }
  }

  return params;
}

// 事前生成されていないパス（存在しないarticle）は404
export const dynamicParams = false;

// 24時間ごとにISR
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { content, title } = await getArticle({ locale, slug });
  const baseUrl = getBaseUrl();

  return getMetadata({
    description: content.slice(0, 300),
    imageUrl: `${baseUrl}/${locale}/articles/${slug}/image`,
    locale: locale as "en" | "ja",
    path: `/blog/${slug}`,
    subTitle: title,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<React.JSX.Element> {
  const { locale, slug } = await params;
  // 存在しないファイルにはそもそもアクセスされない
  const article = await getArticle({ locale, slug });

  return (
    <SWRProvider fallback={{ [`/articles/${slug}`]: article }}>
      <Article slug={slug} />
    </SWRProvider>
  );
}
