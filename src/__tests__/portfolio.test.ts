import { describe, expect, it } from "vitest";
import { CATEGORY_NAMES, getPortfolio } from "@/libs/portfolio";

const locales = ["en", "ja"] as const;

describe("getPortfolio", () => {
  it("resolves every category into displayable items", () => {
    for (const category of CATEGORY_NAMES) {
      for (const locale of locales) {
        const items = getPortfolio(category, locale);

        expect(items.length).toBeGreaterThan(0);

        for (const { href, name } of items) {
          expect(name).toBeTruthy();
          expect(href).toMatch(/^https?:\/\//);
        }
      }
    }
  });

  it("never points an item at itself through altUrl", () => {
    for (const category of CATEGORY_NAMES) {
      for (const { altUrl, href } of getPortfolio(category, "en")) {
        expect(altUrl).not.toBe(href);
      }
    }
  });

  it("sends archived items to their repository when there is one", () => {
    for (const category of CATEGORY_NAMES) {
      for (const { archived, href, repo } of getPortfolio(category, "en")) {
        if (archived && repo !== undefined) {
          expect(href).toBe(repo);
        }
      }
    }
  });

  it("hides the second link on archived items", () => {
    for (const category of CATEGORY_NAMES) {
      for (const { altUrl, archived } of getPortfolio(category, "en")) {
        if (archived) {
          expect(altUrl).toBeUndefined();
        }
      }
    }
  });

  it("keeps the two locales in step, item for item", () => {
    for (const category of CATEGORY_NAMES) {
      const en = getPortfolio(category, "en");
      const ja = getPortfolio(category, "ja");

      expect(ja.map(({ href }) => href)).toEqual(en.map(({ href }) => href));
    }
  });

  it("does not leave one locale's description behind", () => {
    // 説明そのものが無い作品はあってよい。捕まえたいのは、片方の言語だけ
    // 書いて、もう片方を書き忘れた状態のほう。
    const described = (locale: (typeof locales)[number]): string[] =>
      CATEGORY_NAMES.flatMap((category) =>
        getPortfolio(category, locale)
          .filter(({ text }) => text !== "")
          .map(({ href }) => href),
      );

    expect(described("ja")).toEqual(described("en"));
  });
});
