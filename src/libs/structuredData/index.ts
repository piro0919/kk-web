import { getTranslations } from "next-intl/server";
import {
  type Article,
  type Person,
  type WebSite,
  type WithContext,
} from "schema-dts";
import { type Locale } from "@/i18n/routing";
import getBaseUrl from "../getBaseUrl";

export type StructuredDataParams = {
  locale: Locale;
};

export async function createWebSiteStructuredData({
  locale,
}: StructuredDataParams): Promise<WithContext<WebSite>> {
  const baseUrl = getBaseUrl();
  const t = await getTranslations({ locale, namespace: "Site" });

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    author: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
    description: t("description"),
    inLanguage: locale === "en" ? "en-US" : "ja-JP",
    name: "kk-web",
    url: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
  };
}

export function createPersonStructuredData(): WithContext<Person> {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    image: `${baseUrl}/piro.png`,
    jobTitle: "Software Developer",
    name: "piro",
    sameAs: ["https://github.com/piro0919", "https://twitter.com/piro0919"],
    url: baseUrl,
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
  };
}

export type ArticleStructuredDataParams = StructuredDataParams & {
  datePublished: string;
  description: string;
  path: string;
  title: string;
};

export function createArticleStructuredData({
  datePublished,
  description,
  locale,
  path,
  title,
}: ArticleStructuredDataParams): WithContext<Article> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
    datePublished,
    description,
    headline: title,
    inLanguage: locale === "en" ? "en-US" : "ja-JP",
    mainEntityOfPage: {
      "@id": url,
      "@type": "WebPage",
    },
    publisher: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
  };
}
