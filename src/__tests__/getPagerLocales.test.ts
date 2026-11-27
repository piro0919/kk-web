import { describe, expect, it } from "vitest";
import getArticles from "@/libs/getArticles";
import getPagerLocales from "@/libs/getPagerLocales";
import pageSize from "@/libs/pageSize";

/**
 * 一覧の hreflang は、日本語にしか無いページ番号でも英語版を指して 404 を
 * 主張していた。ある言語だけを返すことを、実際の記事数で確かめる。
 */
describe("getPagerLocales", () => {
  it("lists both languages for a page that both have", async () => {
    expect(await getPagerLocales(2)).toEqual(["en", "ja"]);
  });

  it("leaves out english past its last page", async () => {
    const en = await getArticles("en");
    const ja = await getArticles("ja");
    const pastEnglish = Math.ceil(en.length / pageSize) + 1;

    // 日本語のほうが記事が多く、英語に無いページ番号があるという前提を先に確かめる。
    expect(Math.ceil(ja.length / pageSize)).toBeGreaterThanOrEqual(pastEnglish);
    expect(await getPagerLocales(pastEnglish)).toEqual(["ja"]);
  });
});
