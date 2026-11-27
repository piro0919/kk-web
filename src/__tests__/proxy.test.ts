import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import proxy from "../proxy";

/**
 * next-intl の既定では、全ページの応答に hreflang の Link ヘッダーが付く。
 * 中身は全言語を機械的に並べるだけで、日本語にしか無い記事にも英語版を
 * 主張し、HTML とサイトマップの hreflang と食い違っていた。
 * 実際の proxy に通して、付いていないことを確かめる。
 */
describe("proxy", () => {
  it.each([
    "https://kkweb.io/",
    "https://kkweb.io/ja",
    "https://kkweb.io/ja/blog/20210531",
    "https://kkweb.io/ja/blog/page/3",
  ])("does not add an hreflang Link header to %s", (url) => {
    const response = proxy(new NextRequest(url));

    // 転送ではなくページとして通っていることを先に確かめる。
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("link")).toBeNull();
  });
});
