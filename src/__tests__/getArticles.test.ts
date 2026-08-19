import { describe, expect, it } from "vitest";
import getArticles from "@/libs/getArticles";

describe("getArticles", () => {
  it("returns the newest article first", async () => {
    const articles = await getArticles("ja");
    const dates = articles.map(({ date }) => date);

    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("reduces the front matter slug to its last segment", async () => {
    const articles = await getArticles("ja");

    for (const { slug } of articles) {
      expect(slug).not.toContain("/");
      expect(slug).not.toBe("");
    }
  });

  it("keeps slugs unique so the article routes do not collide", async () => {
    const articles = await getArticles("ja");
    const slugs = articles.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps the excerpt on one line and within the limit", async () => {
    const articles = await getArticles("ja");

    for (const { text } of articles) {
      expect(text).not.toMatch(/[\n\r]/);
      // 語の途中で切らないぶん短くなることはあっても、上限は越えない。
      // 末尾の三点リーダを足しても 121 文字に収まる。
      expect(text.length).toBeLessThanOrEqual(121);
    }
  });

  it("gives every article a title and a date", async () => {
    for (const locale of ["en", "ja"] as const) {
      const articles = await getArticles(locale);

      expect(articles.length).toBeGreaterThan(0);

      for (const { date, title } of articles) {
        expect(title).toBeTruthy();
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      }
    }
  });

  it("serves the same list on a second call", async () => {
    const first = await getArticles("en");
    const second = await getArticles("en");

    expect(second).toEqual(first);
  });
});
