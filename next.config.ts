/* eslint-disable filenames/match-regex */
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const projectRoot = import.meta.dirname;
const isProduction = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  // Next 16 で React Compiler が試験扱いを外れ、直下の設定になった。
  reactCompiler: true,
  experimental: {
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
          ]
        : []),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    // 全ホストを許すと、誰でも kkweb.io を画像の中継所として使えてしまい、
    // 画像最適化の枠と転送量を他人に使われる。ポートフォリオのサムネイルが
    // 実際に来る先だけを並べる。
    // 作品を足してサムネイルが出ないときは、その og:image の配信元をここへ。
    remotePatterns: [
      // 自分の作品の置き場。
      { hostname: "**.kkweb.io", protocol: "https" },
      { hostname: "**.vercel.app", protocol: "https" },
      // 動画の配信元。
      { hostname: "i.ytimg.com", protocol: "https" },
      { hostname: "**.cdn.nimg.jp", protocol: "https" },
      // 受託や共同制作で、先方の置き場にあるもの。
      { hostname: "konta-niki.com", protocol: "https" },
      { hostname: "www.natsuzolab.com", protocol: "https" },
      { hostname: "www.nbhyakuhati.com", protocol: "https" },
    ],
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
