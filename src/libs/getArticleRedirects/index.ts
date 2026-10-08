import getArticles from "../getArticles";

export type ArticleRedirect = {
  destination: string;
  permanent: true;
  source: string;
};

/**
 * 片方の言語にしか無い記事を、書いてある言語の住所へ恒久的に転送する。
 *
 * 2025-05 に日本語の記事が `/blog/<slug>` から `/ja/blog/<slug>` へ移り、
 * 古い住所が 404 になった。Google と外部のリンクはまだ古い住所を覚えている。
 * 2026-02 にページの中で転送を足したが、2026-08 の作り直しで消えて 404 に戻った。
 * ページの部品と一緒に消えないよう、next.config の redirects から呼ぶ。
 */
export default async function getArticleRedirects(): Promise<
  ArticleRedirect[]
> {
  const [en, ja] = await Promise.all([getArticles("en"), getArticles("ja")]);
  const enSlugs = new Set(en.map(({ slug }) => slug));
  const jaSlugs = new Set(ja.map(({ slug }) => slug));

  return [
    ...ja
      .filter(({ slug }) => !enSlugs.has(slug))
      .map(({ slug }) => ({
        destination: `/ja/blog/${slug}`,
        permanent: true as const,
        source: `/blog/${slug}`,
      })),
    ...en
      .filter(({ slug }) => !jaSlugs.has(slug))
      .map(({ slug }) => ({
        destination: `/blog/${slug}`,
        permanent: true as const,
        source: `/ja/blog/${slug}`,
      })),
  ];
}
