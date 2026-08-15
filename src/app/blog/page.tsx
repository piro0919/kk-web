import getArticles from "@/libs/getArticles";
import { type Metadata } from "next";
import ArticleList from "../_components/ArticleList";

export const metadata: Metadata = {
  title: "BLOG - kk-web",
};

export default async function Page(): Promise<React.JSX.Element> {
  const articles = await getArticles();

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
