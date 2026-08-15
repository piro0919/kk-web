import getMetadata from "@/libs/getMetadata";
import { XMLParser } from "fast-xml-parser";
import removeMarkdown from "markdown-to-text";
import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ArticleList, { type ArticleListItem } from "../_components/ArticleList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

// 24 時間ごと
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/note",
    subTitle: "NOTE",
  });
}

type Item = {
  description: string;
  link: string;
  pubDate: string;
  title: string;
}[];

async function getNoteArticles(): Promise<ArticleListItem[]> {
  const response = await fetch("https://note.com/kkweb/rss", {
    next: { revalidate: 86400 },
  });
  const text = await response.text();
  const parser = new XMLParser();
  const {
    rss: {
      channel: { item },
    },
  } = parser.parse(text) as { rss: { channel: { item: Item } } };

  return item.map(({ description, link, pubDate, title }) => ({
    date: new Date(pubDate).toISOString().slice(0, 10),
    href: link,
    text: removeMarkdown(description),
    title,
  }));
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  const items = await getNoteArticles();

  return (
    <main>
      <ArticleList external={true} heading="NOTE" items={items} />
    </main>
  );
}
