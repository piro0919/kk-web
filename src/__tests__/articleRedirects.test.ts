import { describe, expect, it } from "vitest";
import getArticles from "@/libs/getArticles";
import nextConfig from "../../next.config";

/**
 * 古い住所の転送は一度、作り直しで消えて 404 に戻った。
 * 部品ではなく実際の next.config を読んで、転送が残っていることを確かめる。
 */
async function configuredRedirects(): Promise<Map<string, string>> {
  const redirects = (await nextConfig.redirects?.()) ?? [];

  return new Map(
    redirects
      .filter((redirect) => redirect.permanent === true)
      .map(({ destination, source }) => [source, destination]),
  );
}

describe("article redirects in next.config", () => {
  it("sends an old japanese-only url to the japanese article", async () => {
    const redirects = await configuredRedirects();

    expect(redirects.get("/blog/20210424")).toBe("/ja/blog/20210424");
  });

  it("covers every article that exists only in japanese", async () => {
    const [en, ja] = await Promise.all([getArticles("en"), getArticles("ja")]);
    const enSlugs = new Set(en.map(({ slug }) => slug));
    const redirects = await configuredRedirects();
    const japaneseOnly = ja.filter(({ slug }) => !enSlugs.has(slug));

    expect(japaneseOnly.length).toBeGreaterThan(0);

    for (const { slug } of japaneseOnly) {
      expect(redirects.get(`/blog/${slug}`)).toBe(`/ja/blog/${slug}`);
    }
  });

  it("covers every article that exists only in english", async () => {
    const [en, ja] = await Promise.all([getArticles("en"), getArticles("ja")]);
    const jaSlugs = new Set(ja.map(({ slug }) => slug));
    const redirects = await configuredRedirects();
    // 今は英語だけの記事が無い。増えたときに転送が漏れていれば、ここで止まる。
    const missing = en
      .filter(({ slug }) => !jaSlugs.has(slug))
      .filter(
        ({ slug }) => redirects.get(`/ja/blog/${slug}`) !== `/blog/${slug}`,
      )
      .map(({ slug }) => slug);

    expect(missing).toEqual([]);
  });

  it("never redirects away from an article that exists", async () => {
    const [en, ja] = await Promise.all([getArticles("en"), getArticles("ja")]);
    const existing = new Set([
      ...en.map(({ slug }) => `/blog/${slug}`),
      ...ja.map(({ slug }) => `/ja/blog/${slug}`),
    ]);
    const redirects = await configuredRedirects();

    expect(redirects.size).toBeGreaterThan(0);

    for (const source of redirects.keys()) {
      expect(existing.has(source)).toBe(false);
    }
  });
});
