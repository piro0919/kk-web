import { describe, expect, it } from "vitest";
import {
  FAVORITE_GENRES,
  FAVORITE_LIMIT,
  getFavorites,
} from "@/libs/favorites";

const locales = ["en", "ja"] as const;

function allItems(
  locale: (typeof locales)[number],
): ReturnType<typeof getFavorites> {
  return FAVORITE_GENRES.flatMap((genre) => getFavorites(genre, locale));
}

describe("getFavorites", () => {
  it("keeps every genre within the limit", () => {
    expect(FAVORITE_GENRES.length).toBeGreaterThan(0);

    for (const genre of FAVORITE_GENRES) {
      expect(getFavorites(genre, "en").length).toBeLessThanOrEqual(
        FAVORITE_LIMIT,
      );
    }
  });

  it("resolves every item into a named link with text in both locales", () => {
    const items = locales.flatMap(allItems);

    expect(items.length).toBeGreaterThan(0);

    for (const { href, name, text } of items) {
      expect(name).toBeTruthy();
      expect(text).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  it("gives every item an image", () => {
    const items = allItems("en");

    expect(items.length).toBeGreaterThan(0);

    for (const { image } of items) {
      expect(image).toMatch(/^https:\/\//);
    }
  });

  it("keeps the two locales in step, item for item", () => {
    expect(FAVORITE_GENRES.length).toBeGreaterThan(0);

    for (const genre of FAVORITE_GENRES) {
      const en = getFavorites(genre, "en");
      const ja = getFavorites(genre, "ja");

      expect(ja.map(({ href }) => href)).toEqual(en.map(({ href }) => href));
    }
  });
});
