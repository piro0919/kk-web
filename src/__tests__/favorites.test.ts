import { describe, expect, it } from "vitest";
import {
  FAVORITE_GENRES,
  FAVORITE_LIMIT,
  getFavorites,
} from "@/libs/favorites";

const locales = ["en", "ja"] as const;

describe("getFavorites", () => {
  it("keeps every genre within the limit", () => {
    for (const genre of FAVORITE_GENRES) {
      expect(getFavorites(genre, "en").length).toBeLessThanOrEqual(
        FAVORITE_LIMIT,
      );
    }
  });

  it("resolves every item into a named link with text in both locales", () => {
    for (const genre of FAVORITE_GENRES) {
      for (const locale of locales) {
        for (const { href, name, text } of getFavorites(genre, locale)) {
          expect(name).toBeTruthy();
          expect(text).toBeTruthy();
          expect(href).toMatch(/^https?:\/\//);
        }
      }
    }
  });

  it("gives every item an image", () => {
    for (const genre of FAVORITE_GENRES) {
      for (const { image } of getFavorites(genre, "en")) {
        expect(image).toMatch(/^https:\/\//);
      }
    }
  });

  it("keeps the two locales in step, item for item", () => {
    for (const genre of FAVORITE_GENRES) {
      const en = getFavorites(genre, "en");
      const ja = getFavorites(genre, "ja");

      expect(ja.map(({ href }) => href)).toEqual(en.map(({ href }) => href));
    }
  });
});
