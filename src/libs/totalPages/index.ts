import pageSize from "../pageSize";

/**
 * 記事一覧のページ数。記事が0件でも1ページ目（/blog）はある。
 * 一覧・ページャー・hreflang が同じ数を使わないと、存在しないページ番号を
 * 指してしまうので、数え方はここにだけ置く。next-sitemap.config.js は
 * TypeScript を読めないので同じ式を書いていて、食い違えば
 * src/__tests__/sitemapPagerLocales.test.ts が落ちる。
 */
export default function totalPages(count: number): number {
  return Math.max(1, Math.ceil(count / pageSize));
}
