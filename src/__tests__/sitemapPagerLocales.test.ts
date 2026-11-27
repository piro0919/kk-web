import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import getArticles from "@/libs/getArticles";
import getPagerLocales from "@/libs/getPagerLocales";
import totalPages from "@/libs/totalPages";
import sitemapConfig from "../../next-sitemap.config.js";

/**
 * サイトマップの設定は TypeScript を読めないので、ページ数の式を自前で
 * 持っている。ページの HTML とサイトマップが一覧の言語版で食い違うと、
 * 片方だけが存在しないページを指す。全ページ番号で突き合わせる。
 */
describe("sitemap and page metadata agree on pager languages", () => {
  it("names the same languages for every page number", async () => {
    const counts = await Promise.all(
      routing.locales.map(async (locale) =>
        totalPages((await getArticles(locale)).length),
      ),
    );
    const last = Math.max(...counts);
    const pages = Array.from({ length: last }, (_, index) => index + 2);

    expect(pages.length).toBeGreaterThan(0);

    for (const page of pages) {
      const entry = await sitemapConfig.transform?.(
        sitemapConfig,
        `/ja/blog/page/${page}`,
      );
      // サイトマップは言語が1つしか無いページに hreflang を付けない。
      const fromSitemap = (entry?.alternateRefs ?? [])
        .map(({ hreflang }) => hreflang)
        .filter((hreflang) => hreflang !== "x-default");
      const fromPage = await getPagerLocales(page);

      expect(fromSitemap, `page ${page}`).toEqual(
        fromPage.length > 1 ? fromPage : [],
      );
    }
  });
});
