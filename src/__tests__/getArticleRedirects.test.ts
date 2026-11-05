import { describe, expect, it, vi } from "vitest";
import getArticleRedirects from "@/libs/getArticleRedirects";

// 今は英語だけの記事が無いので、実際の記事では英語側の転送を確かめられない。
vi.mock("@/libs/getArticles", () => ({
  default: async (locale: string): Promise<{ slug: string }[]> =>
    locale === "en"
      ? [{ slug: "both" }, { slug: "english-only" }]
      : [{ slug: "both" }, { slug: "japanese-only" }],
}));

describe("getArticleRedirects", () => {
  it("sends each one-language article to the language it is written in", async () => {
    await expect(getArticleRedirects()).resolves.toEqual([
      {
        destination: "/ja/blog/japanese-only",
        permanent: true,
        source: "/blog/japanese-only",
      },
      {
        destination: "/blog/english-only",
        permanent: true,
        source: "/ja/blog/english-only",
      },
    ]);
  });
});
