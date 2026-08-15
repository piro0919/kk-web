import { promises as fs } from "fs";
import removeMarkdown from "markdown-to-text";
import parseMD from "parse-md";
import path from "path";

export type Article = {
  content: string;
  date: string;
  slug: string;
  text: string;
  title: string;
};

const ARTICLES_PATH = path.join(process.cwd(), "src/markdown-pages/ja");

function parse(fileContents: string): Article {
  const { content, metadata } = parseMD(fileContents);
  const { date, slug, title } = metadata as {
    date: string;
    slug: string;
    title: string;
  };

  return {
    content,
    date,
    // フロントマターの slug は "/blog/20260522" 形式なので、末尾だけ使う。
    slug: slug.split("/").filter(Boolean).slice(-1)[0],
    text: removeMarkdown(content.slice(0, 200)),
    title,
  };
}

/** 日付の新しい順に全記事を返す。 */
export default async function getArticles(): Promise<Article[]> {
  const filenames = await fs.readdir(ARTICLES_PATH);
  const articles = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const fileContents = await fs.readFile(
          path.join(ARTICLES_PATH, filename),
          "utf8",
        );

        return parse(fileContents);
      }),
  );

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}
