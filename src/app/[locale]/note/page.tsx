import getMetadata from "@/libs/getMetadata";
import { XMLParser } from "fast-xml-parser";
import removeMarkdown from "markdown-to-text";
import { type Metadata } from "next";
import Note from "./_components/Note";

export async function generateStaticParams(): Promise<{ locale: string }[]> {
  return [{ locale: "ja" }];
}

export const dynamicParams = false;

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
    next: { revalidate: 86400 },
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

  return articles;
}

export default async function Page(): Promise<React.JSX.Element> {
  const articles = await getArticles();

  return <Note articles={articles} />;
}
