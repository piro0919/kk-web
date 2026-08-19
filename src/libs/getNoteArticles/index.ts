import { XMLParser } from "fast-xml-parser";
import removeMarkdown from "markdown-to-text";

export type NoteArticle = {
  date: string;
  text: string;
  title: string;
  url: string;
};

type Item = {
  description?: string;
  link?: string;
  pubDate?: string;
  title?: string;
};

/** 日付が読めないものは並び順を壊すので、空にして先頭へ出さない。 */
function toDate(pubDate: unknown): string {
  if (typeof pubDate !== "string") return "";

  const parsed = new Date(pubDate);

  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toISOString().slice(0, 10);
}

/**
 * fast-xml-parser は同じ名前の要素が1つしかないとき、配列ではなく
 * 単体で返す。記事が1本になった日に落ちないよう、必ず配列へ均す。
 */
function toArray(value: unknown): Item[] {
  if (Array.isArray(value)) return value as Item[];

  if (value === null || typeof value !== "object") return [];

  return [value as Item];
}

/**
 * note.com の RSS を24時間ごとに取り直す。
 * 外のサービス頼みなので、落ちていても画面ごと倒れないよう空で返す。
 */
export default async function getNoteArticles(): Promise<NoteArticle[]> {
  try {
    const response = await fetch("https://note.com/kkweb/rss", {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const parser = new XMLParser();
    const parsed = parser.parse(text) as {
      rss?: { channel?: { item?: unknown } };
    };

    return toArray(parsed.rss?.channel?.item)
      .filter(({ link, title }) => typeof link === "string" && title != null)
      .map(({ description, link, pubDate, title }) => ({
        date: toDate(pubDate),
        text:
          typeof description === "string" ? removeMarkdown(description) : "",
        title: String(title),
        url: String(link),
      }));
  } catch {
    return [];
  }
}
