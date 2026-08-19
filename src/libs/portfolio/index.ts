import { type Locale } from "@/i18n/routing";
import snapshot from "./data.json";

/**
 * 作品データの原本は Notion の「Portfolio」データベース。
 * https://app.notion.com/p/3bd2c3b9390c801ea199d6ab9e50f8b1
 * data.json はそこから書き出した写しで、サイトが読むのはこちらだけ。
 * Notion を直したら data.json を作り直してコミットする。
 */

/** Notion の Category 列がそのままカテゴリ名。 */
export const CATEGORY_NAMES = [
  "WEB SERVICE",
  "WEB SITE",
  "APPLICATION",
  "NPM PACKAGE",
  "EXTENSION",
  "MOVIE",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

/** data.json の1件。列は Notion と同じ。 */
export type PortfolioItem = {
  /** 同じものが別の場所にもあるとき。カードの脇にアイコンで出す。 */
  altUrl?: string;
  /** 畳んだもの。一覧の下にまとめ、公開ページではなくリポジトリへ繋ぐ。 */
  archived?: boolean;
  descriptionEn?: string;
  descriptionJa?: string;
  /** 紹介ページ。npm のように配布先と紹介ページが別なときに使う。 */
  lp?: string;
  name: string;
  /** 空なら name をそのまま使う。 */
  nameJa?: string;
  repo?: string;
  url: string;
};

/** 表示に必要な形まで畳んだもの。 */
export type ResolvedItem = {
  altUrl?: string;
  archived: boolean;
  href: string;
  name: string;
  repo?: string;
  text: string;
};

const data: Partial<Record<CategoryName, PortfolioItem[]>> = snapshot;

export function getPortfolio(
  category: CategoryName,
  locale: Locale,
): ResolvedItem[] {
  const items = data[category] ?? [];

  return items.map(
    ({
      altUrl,
      archived = false,
      descriptionEn,
      descriptionJa,
      lp,
      name,
      nameJa,
      repo,
      url,
    }) => ({
      // 紹介ページを主にすると配布先が行き場を失うので、アイコンで残す。
      altUrl: altUrl ?? (!archived && lp ? url : undefined),
      archived,
      // 畳んだものはリポジトリへ。紹介ページがあればそちらを主にする。
      href: archived ? (repo ?? url) : (lp ?? url),
      name: locale === "ja" ? (nameJa ?? name) : name,
      repo,
      text: (locale === "ja" ? descriptionJa : descriptionEn) ?? "",
    }),
  );
}
