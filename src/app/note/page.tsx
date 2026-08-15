import { XMLParser } from "fast-xml-parser";
import removeMarkdown from "markdown-to-text";
import { type Metadata } from "next";
import ArticleList, { type ArticleListItem } from "../_components/ArticleList";

export const metadata: Metadata = {
  title: "NOTE - kk-web",
};

// 24 時間ごと
export const revalidate = 86400;

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

export default async function Page(): Promise<React.JSX.Element> {
  const items = await getNoteArticles();

  return (
    <main>
      <ArticleList external={true} heading="NOTE" items={items} />
    </main>
  );
}
