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

  it("describes every item that is on show, in both locales", () => {
    // 畳んだものは説明を省いてよい。表に出ているものは Notion 側で両方の
    // 言語を埋めてあるので、片方でも書き忘れたらここで止まる。
    for (const locale of locales) {
      const undescribed = CATEGORY_NAMES.flatMap((category) =>
        getPortfolio(category, locale)
          .filter(({ archived, text }) => !archived && text === "")
          .map(({ name }) => name),
      );

      expect(undescribed).toEqual([]);
    }
  });
});
