import { type Metadata } from "next";
import getBaseUrl from "../getBaseUrl";

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
  imageUrl: imageUrlParam,
  locale,
  path = "/",
  subTitle = "",
  type = "article",
}: GetMetadataParams): Metadata {
  const baseUrl = getBaseUrl();
  const imageUrl = imageUrlParam ?? `${baseUrl}/${locale}/opengraph-image`;

  return {
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        en: `${baseUrl}/en${path}`,
        ja: `${baseUrl}/ja${path}`,
      },
    },
    applicationName: "kk-web",
    authors: [{ name: "piro", url: baseUrl }],
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
      locale: locale === "en" ? "en_US" : "ja_JP",
      siteName: "kk-web",
      title: `${subTitle && `${subTitle} - `}kk-web`,
      type,
      url: `${baseUrl}/${locale}${path}`,
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
