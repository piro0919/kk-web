import { promises as fs } from "node:fs";
import path from "node:path";
import parseMD from "parse-md";
import type { UmamiMetric } from ".";

export type EnrichedMetric = {
  date: null | string;
  href: string;
  label: string;
  raw: string;
  y: number;
};

type BlogMeta = {
  date: null | string;
  title: null | string;
};

const STATIC_LABELS = new Map<string, string>([
  ["/", "HOME"],
  ["/about", "ABOUT"],
  ["/blog", "BLOG"],
  ["/contact", "CONTACT"],
  ["/more", "MORE"],
  ["/note", "NOTE"],
  ["/portfolio", "PORTFOLIO"],
  ["/portfolio/application", "PORTFOLIO / APPLICATION"],
  ["/portfolio/movie", "PORTFOLIO / MOVIE"],
  ["/portfolio/npm-package", "PORTFOLIO / NPM PACKAGE"],
  ["/portfolio/web-service", "PORTFOLIO / WEB SERVICE"],
  ["/portfolio/web-site", "PORTFOLIO / WEB SITE"],
  ["/stats", "STATS"],
  ["/writing", "WRITING"],
]);

function stripLocale(rawPath: string): { locale: "en" | "ja"; route: string } {
  if (rawPath.startsWith("/ja/")) {
    return { locale: "ja", route: rawPath.slice(3) };
  }

  if (rawPath === "/ja") {
    return { locale: "ja", route: "/" };
  }

  return { locale: "en", route: rawPath || "/" };
}

async function readBlogMeta(
  locale: "en" | "ja",
  fileDate: string,
): Promise<BlogMeta> {
  try {
    const filePath = path.join(
      process.cwd(),
      "src/markdown-pages",
      locale,
      `${fileDate}.md`,
    );
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileContents = await fs.readFile(filePath, "utf8");
    const { metadata } = parseMD(fileContents);
    const { date, title } = metadata as { date?: string; title?: string };

    return { date: date ?? null, title: title ?? null };
  } catch {
    return { date: null, title: null };
  }
}

async function resolveOne(metric: UmamiMetric): Promise<EnrichedMetric> {
  const { locale, route } = stripLocale(metric.x);
  const blogMatch = /^\/blog\/(\d{8})$/.exec(route);

  let label = STATIC_LABELS.get(route) ?? route;
  let date: null | string = null;

  if (blogMatch) {
    const meta = await readBlogMeta(locale, blogMatch[1]);

    if (meta.title) {
      label = meta.title;
    }

    date = meta.date;
  }

  return {
    date,
    href: route,
    label,
    raw: metric.x,
    y: metric.y,
  };
}

export default async function resolveLabels(
  metrics: UmamiMetric[],
): Promise<EnrichedMetric[]> {
  return Promise.all(metrics.map(resolveOne));
}
