import getArticles from "@/libs/getArticles";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "./_components/Article";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const articles = await getArticles();

  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((item) => item.slug === slug);

  return {
    title: article ? `${article.title} - kk-web` : "kk-web",
  };
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main>
      <Article article={article} />
    </main>
  );
}
