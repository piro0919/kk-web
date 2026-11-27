import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // 既定では全ページの応答に hreflang の Link ヘッダーが付く。中身は全言語を
  // 機械的に並べるだけなので、日本語にしか無い記事でも英語版があると主張し、
  // HTML とサイトマップの hreflang と食い違っていた。その2つに任せて切る。
  alternateLinks: false,
  defaultLocale: "en",
  localePrefix: "as-needed",
  locales: ["en", "ja"],
});

/** 扱う言語。locales を直に書き写さず、ここから引く。 */
export type Locale = (typeof routing.locales)[number];

/**
 * 動的区画から来た文字列を言語として読む。
 * レイアウトが hasLocale で弾いているので、実際にここまで来るのは正しい値だけ。
 * それでも as で押し通さないのは、区画の名前を変えたときに黙って壊れないため。
 */
export function toLocale(value: string): Locale {
  return routing.locales.includes(value as Locale)
    ? (value as Locale)
    : routing.defaultLocale;
}
