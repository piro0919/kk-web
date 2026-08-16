import { type Metadata } from "next";
import getBaseUrl from "../getBaseUrl";

export type GetMetadataParams = {
  description?: string;
  /** 既定は共通の opengraph-image。記事のように専用の絵があるときだけ渡す。 */
  imagePath?: string;
  locale: "en" | "ja";
  path?: string;
  subTitle?: string;
  type?: "article" | "website";
};

export default function getMetadata({
  description = "Software Developer piro's website",
  imagePath,
  locale,
  path = "/",
  subTitle = "",
  type = "website",
}: GetMetadataParams): Metadata {
  const baseUrl = getBaseUrl();
  // 英語は接頭辞なしが正。canonical と og:url で同じ URL を出す。
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const url = `${baseUrl}${localePrefix}${path}`;
  // 下位ページが generateMetadata を持つと親の openGraph ごと差し替わり、
  // opengraph-image.tsx の自動挿入が効かない。全ページで明示する。
  // 画像は接頭辞を必ず付ける。middleware の matcher が opengraph-image を
  // 除外しているので、接頭辞なしだと英語の記事画像が 404 になる。
  // canonical と違い、ここは正規 URL である必要がない。
  const image = {
    alt: "kk-web",
    height: 630,
    url: `${baseUrl}/${locale}${imagePath ?? "/opengraph-image"}`,
    width: 1200,
  };

  return {
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}${path}`,
        ja: `${baseUrl}/ja${path}`,
      },
    },
    applicationName: "kk-web",
    authors: [{ name: "piro", url: baseUrl }],
    creator: "piro",
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      description,
      images: [image],
      locale: locale === "en" ? "en_US" : "ja_JP",
      siteName: "kk-web",
      title: `${subTitle && `${subTitle} - `}kk-web`,
      type,
      url,
    },
    robots: {
      follow: true,
      index: true,
    },
    title: `${subTitle && `${subTitle} - `}kk-web`,
    twitter: {
      card: "summary_large_image",
      images: [image],
    },
  };
}
