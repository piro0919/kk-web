import { type Locale } from "@/i18n/routing";
import snapshot from "./data.json";

/**
 * 品のデータの原本は Notion の「Favorites」データベース。
 * https://app.notion.com/p/72103272d79f4d5ab0ed162ddabe6a51
 * data.json はそこから書き出した写しで、サイトが読むのはこちらだけ。
 * Notion を直したら data.json を作り直してコミットする。
 */

/** Notion のジャンル列がそのままジャンル名。 */
export const FAVORITE_GENRES = ["MANGA", "ALCOHOL", "GADGET"] as const;

export type FavoriteGenre = (typeof FAVORITE_GENRES)[number];

/** 各ジャンルに載せられる数。超える前に1件外す。 */
export const FAVORITE_LIMIT = 9;

/** data.json の1件。列は Notion と同じ。 */
type FavoriteItem = {
  descriptionEn?: string;
  descriptionJa?: string;
  image?: string;
  name: string;
  /** 空なら name をそのまま使う。 */
  nameJa?: string;
  url: string;
};

/** 表示に必要な形まで畳んだもの。 */
export type ResolvedFavorite = {
  href: string;
  image?: string;
  name: string;
  text: string;
};

const data: Record<FavoriteGenre, FavoriteItem[]> = snapshot;

export function getFavorites(
  genre: FavoriteGenre,
  locale: Locale,
): ResolvedFavorite[] {
  return data[genre].map(
    ({ descriptionEn, descriptionJa, image, name, nameJa, url }) => ({
      href: url,
      image,
      name: locale === "ja" ? (nameJa ?? name) : name,
      text: (locale === "ja" ? descriptionJa : descriptionEn) ?? "",
    }),
  );
}
