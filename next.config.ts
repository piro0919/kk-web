/* eslint-disable filenames/match-exported, filenames/match-regex */
import createNextIntlPlugin from "next-intl/plugin";
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
            // コードと書体はファイル名にハッシュが入るので固定して良い。
            {
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
              source: "/(.*)\\.(js|css|woff|woff2)",
            },
            // 画像は public 配下が名前のまま置き換わる。immutable にすると
            // 差し替えても最長1年間そのままになるので、再検証させる。
            {
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=86400, stale-while-revalidate=604800",
                },
              ],
              source: "/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico)",
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
    // OGP 画像は任意のドメインから来るため、https を広く許可する。
    remotePatterns: [{ hostname: "**", protocol: "https" }],
  },
  // OGP 画像は public の絵をファイルから読む。ファイル名が変数なので
  // 依存追跡が静的に見つけられず、関数に同梱されない。明示して入れる。
  outputFileTracingIncludes: {
    "/[locale]/blog/[slug]/opengraph-image": [
      "./public/ogp-background.png",
      "./public/metan_05.png",
      "./public/tsumugi_24.png",
    ],
    "/[locale]/opengraph-image": [
      "./public/bubble.png",
      "./public/ogp-background.png",
      "./public/metan_05.png",
      "./public/tsumugi_24.png",
    ],
  },
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  typedRoutes: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
