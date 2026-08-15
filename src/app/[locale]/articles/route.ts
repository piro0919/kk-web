import getArticles from "@/libs/getArticles";
import pageSize from "@/libs/pageSize";
import { type NextRequest, NextResponse } from "next/server";

export type GetArticlesResponseBody = {
  date: string;
  href: string;
  text: string;
  title: string;
}[];

/** 記事一覧の続きを返す。無限スクロールから叩かれる。 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
): Promise<NextResponse<GetArticlesResponseBody>> {
  const { locale } = await params;
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
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
