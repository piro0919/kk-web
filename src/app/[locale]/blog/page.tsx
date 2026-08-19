import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import getArticles from "@/libs/getArticles";
import getMetadata from "@/libs/getMetadata";
import pageSize from "@/libs/pageSize";
import ArticleList from "../_components/ArticleList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: toLocale(locale),
    path: "/blog",
    subTitle: "BLOG",
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  const articles = await getArticles(toLocale(locale));
  const firstPage = articles.slice(0, pageSize);

  return (
    <main>
      <ArticleList
        items={firstPage.map(({ date, slug, text, title }) => ({
          date,
          href: `/blog/${slug}`,
          text,
          title,
        }))}
        heading="BLOG"
        infinite={true}
      />
    </main>
  );
}
