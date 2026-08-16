import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import getMetadata from "@/libs/getMetadata";
import getNoteArticles from "@/libs/getNoteArticles";
import ArticleList from "../_components/ArticleList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

// 24 時間ごと
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/note",
    subTitle: "NOTE",
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  const articles = await getNoteArticles();

  return (
    <main>
      <ArticleList
        items={articles.map(({ date, text, title, url }) => ({
          date,
          href: url,
          text,
          title,
        }))}
        external={true}
        heading="NOTE"
      />
    </main>
  );
}
