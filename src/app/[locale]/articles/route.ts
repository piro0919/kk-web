import { type NextRequest, NextResponse } from "next/server";
import { type ArticleListItem } from "@/app/[locale]/_components/ArticleList";
import { toLocale } from "@/i18n/routing";
import getArticles from "@/libs/getArticles";
import pageSize from "@/libs/pageSize";

// 一覧に渡す形と同じものを返す。片方だけ直して食い違うことがないよう、
// 型は画面側の1つを使う。
export type GetArticlesResponseBody = ArticleListItem[];

/** 記事一覧の続きを返す。無限スクロールから叩かれる。 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
): Promise<NextResponse<GetArticlesResponseBody>> {
  const { locale } = await params;
  const requested = Number(request.nextUrl.searchParams.get("page") ?? "0");
  // 読めない値は先頭として扱う。負の頁を渡されて末尾が返るのを防ぐ。
  const page =
    Number.isSafeInteger(requested) && requested >= 0 ? requested : 0;
  const articles = await getArticles(toLocale(locale));
  const items = articles
    .slice(page * pageSize, (page + 1) * pageSize)
    .map(({ date, slug, text, title }) => ({
      date,
      href: `/blog/${slug}`,
      text,
      title,
    }));

  // 記事はリポジトリの中にあり、変わるのはデプロイのときだけ。毎回読み直さず
  // CDN に持たせる。ブラウザには持たせない。
  return NextResponse.json(items, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
