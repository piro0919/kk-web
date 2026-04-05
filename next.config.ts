// eslint-disable-next-line filenames/match-regex
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    typedEnv: true,
    useLightningcss: true,
  },
  typedRoutes: true,
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
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    remotePatterns: [],
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
