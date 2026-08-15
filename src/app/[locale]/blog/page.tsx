import getArticles from "@/libs/getArticles";
import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ArticleList from "../_components/ArticleList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/blog",
    subTitle: "BLOG",
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  const articles = await getArticles(locale as "en" | "ja");

  return (
    <main>
      <ArticleList
        items={articles.map(({ date, slug, text, title }) => ({
          date,
          href: `/blog/${slug}`,
          text,
          title,
        }))}
        heading="BLOG"
      />
    </main>
  );
}
