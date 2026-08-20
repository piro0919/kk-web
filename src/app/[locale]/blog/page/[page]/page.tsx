import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import getArticles from "@/libs/getArticles";
import getMetadata from "@/libs/getMetadata";
import pageSize from "@/libs/pageSize";
import ArticleList from "../../../_components/ArticleList";
import Pager from "../../../_components/Pager";

type PageProps = {
  params: Promise<{ locale: string; page: string }>;
};

function totalPages(count: number): number {
  return Math.max(1, Math.ceil(count / pageSize));
}

/** 2ページ目以降だけを作る。1ページ目は /blog が持っているので、
    ここで作ると同じ内容が2つの URL に出てしまう。 */
export async function generateStaticParams(): Promise<
  { locale: string; page: string }[]
> {
  const params = await Promise.all(
    routing.locales.map(async (locale) => {
      const articles = await getArticles(locale);

      return Array.from(
        { length: totalPages(articles.length) - 1 },
        (_, index) => ({
          locale,
          page: String(index + 2),
        }),
      );
    }),
  );

  return params.flat();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, page } = await params;

  return getMetadata({
    locale: toLocale(locale),
    path: `/blog/page/${page}`,
    subTitle: `BLOG (${page})`,
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, page } = await params;

  setRequestLocale(locale);

  const articles = await getArticles(toLocale(locale));
  const total = totalPages(articles.length);
  const current = Number(page);

  // 範囲外と数字でない頁は 404 にする。存在しない URL を薄い中身で返さない。
  if (!Number.isSafeInteger(current) || current < 2 || current > total) {
    notFound();
  }

  const items = articles.slice((current - 1) * pageSize, current * pageSize);

  return (
    <main>
      <ArticleList
        items={items.map(({ date, slug, text, title }) => ({
          date,
          href: `/blog/${slug}`,
          text,
          title,
        }))}
        heading="BLOG"
      />
      <Pager basePath="/blog" current={current} total={total} />
    </main>
  );
}
