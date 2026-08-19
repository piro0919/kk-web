import { type NextRequest, NextResponse } from "next/server";
import { type ArticleListItem } from "@/app/[locale]/_components/ArticleList";
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
  const articles = await getArticles(locale === "en" ? "en" : "ja");
  const items = articles
    .slice(page * pageSize, (page + 1) * pageSize)
    .map(({ date, slug, text, title }) => ({
      date,
      href: `/blog/${slug}`,
      text,
      title,
    }));

  return NextResponse.json(items);
}
