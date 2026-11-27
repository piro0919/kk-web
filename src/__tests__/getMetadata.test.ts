import { describe, expect, it, vi } from "vitest";
import getBaseUrl from "@/libs/getBaseUrl";
import getMetadata from "@/libs/getMetadata";

// 説明文の翻訳はこのテストの対象ではない。next-intl の読み込み設定は
// Next の外では作れないので、鍵をそのまま返すものに差し替える。
vi.mock("next-intl/server", () => ({
  getTranslations: async (): Promise<(key: string) => string> => (key) => key,
}));

describe("getMetadata", () => {
  it("lists only the given languages in hreflang", async () => {
    const { alternates } = await getMetadata({
      locale: "ja",
      locales: ["ja"],
      path: "/blog/page/10",
    });

    expect(alternates?.languages).toEqual({
      ja: `${getBaseUrl()}/ja/blog/page/10`,
      "x-default": `${getBaseUrl()}/ja/blog/page/10`,
    });
  });

  // 範囲外のページ番号では、言語の一覧が空で渡ってくる。
  it("falls back to the page's own language when none is given", async () => {
    const { alternates } = await getMetadata({
      locale: "ja",
      locales: [],
      path: "/blog/page/999",
    });

    expect(alternates?.languages).toEqual({
      ja: `${getBaseUrl()}/ja/blog/page/999`,
      "x-default": `${getBaseUrl()}/ja/blog/page/999`,
    });
  });
});
