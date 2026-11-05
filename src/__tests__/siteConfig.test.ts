import { type IConfig } from "next-sitemap";
import { describe, expect, it } from "vitest";
import sitemapConfig from "../../next-sitemap.config";
import nextConfig from "../../next.config";

const { additionalPaths, transform } = sitemapConfig as Required<IConfig>;

describe("response headers", () => {
  async function siteHeaders(): Promise<Map<string, string>> {
    const rules = (await nextConfig.headers?.()) ?? [];
    const headers = rules.find(({ source }) => source === "/(.*)")?.headers;

    return new Map(headers?.map(({ key, value }) => [key, value]));
  }

  it("refuses to be framed by another site", async () => {
    const values = await siteHeaders();

    expect(values.get("Content-Security-Policy")).toBe(
      "frame-ancestors 'none'",
    );
    expect(values.get("X-Frame-Options")).toBe("DENY");
  });

  it("turns off the camera, location and microphone", async () => {
    const values = await siteHeaders();

    expect(values.get("Permissions-Policy")).toBe(
      "camera=(), geolocation=(), microphone=()",
    );
  });
});

describe("sitemap", () => {
  it("does not stamp pages with the build time", async () => {
    const entry = await transform(sitemapConfig, "/ja/about");

    expect(entry?.loc).toBe("/ja/about");
    expect(entry?.lastmod).toBeUndefined();
  });

  it("keeps the published date on articles", async () => {
    const entries = await additionalPaths({
      ...sitemapConfig,
      transform,
    });

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.filter((entry) => !entry?.lastmod)).toEqual([]);
  });
});
