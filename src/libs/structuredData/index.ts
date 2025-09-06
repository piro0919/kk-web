import { getTranslations } from "next-intl/server";
import {
  type Article,
  type Person,
  type WebSite,
  type WithContext,
} from "schema-dts";
import getBaseUrl from "../getBaseUrl";

export type StructuredDataParams = {
  locale: "en" | "ja";
};

export type ArticleStructuredDataParams = StructuredDataParams & {
  author?: string;
  dateModified?: string;
  datePublished: string;
  description: string;
  path: string;
  title: string;
};

export async function createWebSiteStructuredData({
  locale,
}: StructuredDataParams): Promise<WithContext<WebSite>> {
  const baseUrl = getBaseUrl();
  const t = await getTranslations({ locale, namespace: "StructuredData" });

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    author: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
    description: t("siteDescription"),
    inLanguage: locale === "en" ? "en-US" : "ja-JP",
    name: "kk-web",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${locale}/blog?search={search_term_string}`,
      },
    },
    url: `${baseUrl}/${locale}`,
  };
}

export function createPersonStructuredData(): WithContext<Person> {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    jobTitle: "Frontend Developer",
    name: "piro",
    sameAs: ["https://github.com/piro0919", "https://twitter.com/piro0919"],
    url: baseUrl,
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
  };
}

export function createArticleStructuredData({
  author = "piro",
  dateModified,
  datePublished,
  description,
  locale,
  path,
  title,
}: ArticleStructuredDataParams): WithContext<Article> {
  const baseUrl = getBaseUrl();
  const fullUrl = `${baseUrl}/${locale}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Person",
      name: author,
      url: baseUrl,
    },
    dateModified: dateModified || datePublished,
    datePublished,
    description,
    headline: title,
    image: `${baseUrl}/${locale}/opengraph-image`,
    inLanguage: locale === "en" ? "en-US" : "ja-JP",
    mainEntityOfPage: {
      "@id": fullUrl,
      "@type": "WebPage",
    },
    publisher: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
    url: fullUrl,
  };
}
