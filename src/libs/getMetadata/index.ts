import { Metadata } from "next";

export type GetMetadataParams = {
  description?: string;
  imageUrl?: string;
  path?: string;
  subTitle?: string;
  type?: "article" | "website";
};

export default function getMetadata({
  description = "Frontend Developer piro's website",
  imageUrl = "https://kk-web.link/kk-web_0.png",
  path = "/",
  subTitle = "",
  type = "article",
}: GetMetadataParams): Metadata {
  return {
    alternates: {
      canonical: `https://kk-web.link${path}`,
    },
    applicationName: "kk-web",
    authors: [{ name: "piro", url: "https://kk-web.link" }],
    creator: "piro",
    description,
    openGraph: {
      description,
      images: [
        {
          url: imageUrl,
        },
      ],
      siteName: "kk-web",
      title: `${subTitle && `${subTitle} - `}kk-web`,
      type,
      url: `https://kk-web.link${path}`,
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
