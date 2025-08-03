import getMetadata from "@/libs/getMetadata";
import { XMLParser } from "fast-xml-parser";
import removeMarkdown from "markdown-to-text";
import { type Metadata } from "next";
import Note from "./_components/Note";

// TODO: デバッグ用
// export const revalidate = 86400;
export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/note",
    subTitle: "NOTE",
  });
}

type Article = {
  date: string;
  slug: string;
  text: string;
  title: string;
};

type GetArticlesData = Article[];

type Item = {
  description: string;
  guid: string;
  link: string;
  pubDate: string;
  title: string;
}[];

async function getArticles(): Promise<GetArticlesData> {
  const response = await fetch("https://note.com/kkweb/rss", {
    // TODO: デバッグ用
    // next: { revalidate: 86400 },
    next: { revalidate: 10 },
  });
  const text = await response.text();
  const parser = new XMLParser();
  const {
    rss: {
      channel: { item },
    },
  } = parser.parse(text);
  const articles = (item as Item).map(
    ({ description, link, pubDate, title }) => ({
      date: pubDate,
      slug: link,
      text: removeMarkdown(description),
      title,
    }),
  );

  // TODO: デバッグ用
  // eslint-disable-next-line no-console
  console.log(articles.map((article) => article.title).join(", "));

  return articles;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;

  if (locale !== "ja") {
    throw new Error("Not Found");
  }

  const articles = await getArticles();

  return <Note articles={articles} />;
}
