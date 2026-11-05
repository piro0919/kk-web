import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/[locale]/articles/route";

describe("GET /[locale]/articles", () => {
  it("lets the CDN keep the list but not the browser", async () => {
    const response = await GET(
      new NextRequest("https://kkweb.io/ja/articles?page=0"),
      { params: Promise.resolve({ locale: "ja" }) },
    );
    const body = (await response.json()) as unknown[];

    expect(body.length).toBeGreaterThan(0);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    );
  });
});
