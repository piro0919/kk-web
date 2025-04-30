import { type Metadata } from "next";

export type GetMetadataParams = {
  description?: string;
  imageUrl?: string;
  locale: "en" | "ja";
  path?: string;
  subTitle?: string;
  type?: "article" | "website";
};

export default function getMetadata({
  description = "Frontend Developer piro's website",
  imageUrl = "https://kk-web.link/kk-web_0.png",
  locale,
  path = "/",
  subTitle = "",
  type = "article",
}: GetMetadataParams): Metadata {
  return {
    alternates: {
      canonical: `https://kk-web.link${path}`,
      languages: {
        en: `https://kk-web.link/en${path}`,
        ja: `https://kk-web.link/ja${path}`,
      },
    },
    applicationName: "kk-web",
    authors: [{ name: "piro", url: "https://kk-web.link" }],
    creator: "piro",
    description,
    openGraph: {
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      description,
      images: [
        {
          url: imageUrl,
        },
      ],
      locale,
      siteName: "kk-web",
      title: `${subTitle && `${subTitle} - `}kk-web`,
      type,
      url: `https://kk-web.link/${locale}${path}`,
    },
    robots: {
      follow: true,
      index: true,
    },
    title: `${subTitle && `${subTitle} - `}kk-web`,
    twitter: {
      card: "summary_large_image",
      images: imageUrl,
    },
  };
}
