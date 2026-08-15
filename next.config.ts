/* eslint-disable filenames/match-exported, filenames/match-regex */
import type { NextConfig } from "next";

const projectRoot = import.meta.dirname;
const isProduction = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    typedEnv: true,
    useLightningcss: true,
  },
  async headers() {
    return [
      {
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
        source: "/(.*)",
      },
      // immutable は本番だけに付ける。開発中に付けるとブラウザが
      // チャンクを再検証しなくなり、コードを直しても反映されない。
      ...(isProduction
        ? [
            {
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
              source:
                "/(.*)\\.(js|css|woff|woff2|png|jpg|jpeg|gif|webp|avif|svg|ico)",
            },
            {
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
              source: "/_next/static/(.*)",
            },
          ]
        : []),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    remotePatterns: [],
  },
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  typedRoutes: true,
};

export default nextConfig;
