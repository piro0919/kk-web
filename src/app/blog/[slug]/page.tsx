import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import parseMD from "parse-md";
import Article from "./_components/Article";
import SWRProvider from "./swr-provider";
import getMetadata from "@/libs/getMetadata";

type GetArticleParams = {
  slug: string;
};

type GetArticleData = {
  content: string;
  date: string;
  title: string;
};

async function getArticle({ slug }: GetArticleParams): Promise<GetArticleData> {
  const markdownPath = path.join(
    process.cwd(),
    "/src/markdown-pages",
    `${slug}.md`,
  );
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
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const { content, title } = await getArticle({ slug });

  return getMetadata({
    description: content.slice(0, 300),
    // imageUrl: `http://localhost:3000/articles/${slug}/image`,
    imageUrl: `https://kk-web.link/articles/${slug}/image`,
    path: `/blog/${slug}`,
    subTitle: title,
  });
}

// 24 時間ごと
export const revalidate = 86400;

export default async function Page({
  params: { slug },
}: PageProps): Promise<JSX.Element> {
  const article = await getArticle({ slug });

  return (
    <SWRProvider fallback={{ [`/articles/${slug}`]: article }}>
      <Article slug={slug} />
    </SWRProvider>
  );
}
