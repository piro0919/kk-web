import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import getBaseUrl from "../getBaseUrl";

export type GetMetadataParams = {
  description?: string;
  /** 既定は共通の opengraph-image。記事のように専用の絵があるときだけ渡す。 */
  imagePath?: string;
  locale: "en" | "ja";
  /** その URL が存在する言語。記事は片方しか無いことがあるので絞れるようにする。 */
  locales?: ("en" | "ja")[];
  path?: string;
  subTitle?: string;
  type?: "article" | "website";
};

export default async function getMetadata({
  description,
  imagePath,
  locale,
  locales = ["en", "ja"],
  path = "/",
  subTitle = "",
  type = "website",
}: GetMetadataParams): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const t = await getTranslations({ locale, namespace: "Site" });
  // 英語は接頭辞なしが正。canonical と og:url で同じ URL を出す。
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  // トップの path は "/" で来る。そのまま繋ぐと /ja/ になり、実体の /ja へ
  // 308 で飛ぶ URL を canonical と hreflang が指してしまう。空に均す。
  const pathname = path === "/" ? "" : path;
  const url = `${baseUrl}${localePrefix}${pathname}`;
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
  // 存在しない言語版を指すと、その指定はまるごと無視される。
  // 実際にある言語だけ並べる。
  const languages = Object.fromEntries(
    locales.map((available) => [
      available,
      `${baseUrl}${available === "en" ? "" : `/${available}`}${pathname}`,
    ]),
  );
  const text = description ?? t("description");

  return {
    alternates: {
      canonical: url,
      languages,
    },
    applicationName: "kk-web",
    authors: [{ name: "piro", url: baseUrl }],
    creator: "piro",
    description: text,
    metadataBase: new URL(baseUrl),
    openGraph: {
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      description: text,
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
