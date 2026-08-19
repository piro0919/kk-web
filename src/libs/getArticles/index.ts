import { promises as fs } from "fs";
import removeMarkdown from "markdown-to-text";
import parseMD from "parse-md";
import path from "path";
import { type Locale } from "@/i18n/routing";

export type Article = {
  content: string;
  date: string;
  slug: string;
  text: string;
  title: string;
};

/**
 * 一覧と og:description に使う抜粋。
 * 記法と改行を落として1行に均し、語の途中で切らない。
 */
function excerpt(content: string, length = 120): string {
  // 全文から記法を落とすと重いので、必要な分より少し多めに切ってから均す。
  const plain = removeMarkdown(content.slice(0, 600))
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= length) {
    return plain;
  }

  const cut = plain.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");

  // 英文は単語の頭まで戻す。日本語は空白が無いので、戻さずそのまま切る。
  return `${lastSpace > length * 0.6 ? cut.slice(0, lastSpace) : cut}…`;
}

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
    text: excerpt(content),
    title,
  };
}

/** 記事はビルド時に固定なので、言語ごとに一度読んだら使い回す。 */
const cache = new Map<Locale, Promise<Article[]>>();
// 開発中だけは毎回読み直す。md は import していないので Next が変更に
// 気付けず、覚えたままだと記事を足しても再起動するまで出てこない。
const isCacheable = process.env.NODE_ENV !== "development";

async function read(locale: Locale): Promise<Article[]> {
  const articlesPath = path.join(
    process.cwd(),
    "src/markdown-pages",
    locale === "en" ? "en" : "ja",
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const filenames = await fs.readdir(articlesPath);
  const articles = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const fileContents = await fs.readFile(
          path.join(articlesPath, filename),
          "utf8",
        );

        return parse(fileContents);
      }),
  );

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 指定した言語の記事を、日付の新しい順に返す。
 * 記事1本を出すのに generateMetadata・本体・OGP 画像から何度も呼ばれる。
 * 毎回 500 近いファイルを読み直すとビルドが記事数の二乗で伸びるので、
 * 読み込みそのものを言語ごとに1回へ畳む。失敗は覚えず、次で読み直す。
 */
export default async function getArticles(locale: Locale): Promise<Article[]> {
  if (!isCacheable) {
    return read(locale);
  }

  const cached = cache.get(locale);

  if (cached) {
    return cached;
  }

  const pending = read(locale).catch((error: unknown) => {
    cache.delete(locale);

    throw error;
  });

  cache.set(locale, pending);

  return pending;
}
