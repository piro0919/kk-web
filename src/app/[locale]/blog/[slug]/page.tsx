import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, toLocale } from "@/i18n/routing";
import getArticles from "@/libs/getArticles";
import getMetadata from "@/libs/getMetadata";
import { createArticleStructuredData } from "@/libs/structuredData";
import StructuredData from "../../_components/StructuredData";
import Article from "./_components/Article";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  const params = await Promise.all(
    routing.locales.map(async (locale) => {
      const articles = await getArticles(locale);

      return articles.map(({ slug }) => ({ locale, slug }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const articles = await getArticles(toLocale(locale));
  const article = articles.find((item) => item.slug === slug);
  // 記事は片方の言語にしか無いことが多い。書いてある言語だけを別言語版として出す。
  const written = await Promise.all(
    routing.locales.map(async (available) => {
      const written = await getArticles(available);

      return written.some((item) => item.slug === slug) ? available : null;
    }),
  );

  return getMetadata({
    description: article?.text,
    imagePath: `/blog/${slug}/opengraph-image`,
    locale: toLocale(locale),
    locales: written.filter((item) => item !== null),
    path: `/blog/${slug}`,
    subTitle: article?.title,
    type: "article",
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const articles = await getArticles(toLocale(locale));
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <StructuredData
        data={createArticleStructuredData({
          datePublished: article.date,
          description: article.text,
          locale: toLocale(locale),
          path: `/blog/${article.slug}`,
          title: article.title,
        })}
      />
      <Article article={article} />
    </main>
  );
}
