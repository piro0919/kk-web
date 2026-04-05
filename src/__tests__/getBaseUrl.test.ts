import { afterEach, describe, expect, it } from "vitest";
import getBaseUrl from "../libs/getBaseUrl";

describe("getBaseUrl", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should return production URL when VERCEL_ENV is production", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_URL = "some-deploy.vercel.app";

    expect(getBaseUrl()).toBe("https://kkweb.io");
  });

  it("should return VERCEL_URL when VERCEL_ENV is not production", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_URL = "my-preview.vercel.app";

    expect(getBaseUrl()).toBe("https://my-preview.vercel.app");
  });

  it("should return localhost when no Vercel env vars are set", () => {
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL_URL;

    expect(getBaseUrl()).toBe("http://localhost:3000");
  });
});
