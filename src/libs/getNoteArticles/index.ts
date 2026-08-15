import { XMLParser } from "fast-xml-parser";
import removeMarkdown from "markdown-to-text";

export type NoteArticle = {
  date: string;
  text: string;
  title: string;
  url: string;
};

type Item = {
  description: string;
  link: string;
  pubDate: string;
  title: string;
}[];

/** note.com の RSS を24時間ごとに取り直す。 */
export default async function getNoteArticles(): Promise<NoteArticle[]> {
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
    text: removeMarkdown(description),
    title,
    url: link,
  }));
}
