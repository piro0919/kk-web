import { describe, expect, it } from "vitest";
import { CATEGORY_NAMES, getPortfolio } from "@/libs/portfolio";

const locales = ["en", "ja"] as const;

function allItems(
  locale: (typeof locales)[number],
): ReturnType<typeof getPortfolio> {
  return CATEGORY_NAMES.flatMap((category) => getPortfolio(category, locale));
}

describe("getPortfolio", () => {
  it("resolves every category into displayable items", () => {
    const empty = CATEGORY_NAMES.flatMap((category) =>
      locales
        .filter((locale) => getPortfolio(category, locale).length === 0)
        .map((locale) => `${category}/${locale}`),
    );

    expect(CATEGORY_NAMES.length).toBeGreaterThan(0);
    expect(empty).toEqual([]);

    for (const { href, name } of locales.flatMap(allItems)) {
      expect(name).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  it("never points an item at itself through altUrl", () => {
    const items = allItems("en");

    expect(items.length).toBeGreaterThan(0);

    for (const { altUrl, href } of items) {
      expect(altUrl).not.toBe(href);
    }
  });

  it("sends archived items to their repository when there is one", () => {
    const items = allItems("en").filter(
      ({ archived, repo }) => archived && repo !== undefined,
    );

    expect(items.length).toBeGreaterThan(0);

    for (const { href, repo } of items) {
      expect(href).toBe(repo);
    }
  });

  it("hides the second link on archived items", () => {
    const items = allItems("en").filter(({ archived }) => archived);

    expect(items.length).toBeGreaterThan(0);

    for (const { altUrl } of items) {
      expect(altUrl).toBeUndefined();
    }
  });

  it("keeps the two locales in step, item for item", () => {
    expect(CATEGORY_NAMES.length).toBeGreaterThan(0);

    for (const category of CATEGORY_NAMES) {
      const en = getPortfolio(category, "en");
      const ja = getPortfolio(category, "ja");

      expect(ja.map(({ href }) => href)).toEqual(en.map(({ href }) => href));
    }
  });

  it("describes every item that is on show, in both locales", () => {
    // 畳んだものは説明を省いてよい。表に出ているものは Notion 側で両方の
    // 言語を埋めてあるので、片方でも書き忘れたらここで止まる。
    const onShow = locales
      .flatMap(allItems)
      .filter(({ archived }) => !archived);

    expect(onShow.length).toBeGreaterThan(0);
    expect(
      onShow.filter(({ text }) => text === "").map(({ name }) => name),
    ).toEqual([]);
  });
});
