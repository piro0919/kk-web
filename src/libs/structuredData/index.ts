import {
  type Article,
  type Person,
  type WebSite,
  type WithContext,
} from "schema-dts";
import getBaseUrl from "../getBaseUrl";

export const SITE_DESCRIPTION =
  "フロントエンドデベロッパー piro のウェブサイト";

export function createWebSiteStructuredData(): WithContext<WebSite> {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    author: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
    description: SITE_DESCRIPTION,
    inLanguage: "ja-JP",
    name: "kk-web",
    url: baseUrl,
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

export type ArticleStructuredDataParams = {
  datePublished: string;
  description: string;
  path: string;
  title: string;
};

export function createArticleStructuredData({
  datePublished,
  description,
  path,
  title,
}: ArticleStructuredDataParams): WithContext<Article> {
  const baseUrl = getBaseUrl();

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
    inLanguage: "ja-JP",
    mainEntityOfPage: {
      "@id": `${baseUrl}${path}`,
      "@type": "WebPage",
    },
    publisher: {
      "@type": "Person",
      name: "piro",
      url: baseUrl,
    },
  };
}
