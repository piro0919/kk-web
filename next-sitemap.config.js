import { promises as fs, readdirSync } from "node:fs";
import path from "node:path";
import parseMD from "parse-md";

const locales = ["en", "ja"];
const defaultLocale = "en";

/* 記事は片方の言語しか無いものが多い。存在しない言語版を指した hreflang は
   まるごと無視されるので、実際にある言語だけを並べる */
const blogSlugs = Object.fromEntries(
  locales.map((locale) => {
    const dir = path.join(process.cwd(), "src/markdown-pages", locale);

    try {
      return [
        locale,
        new Set(
          readdirSync(dir)
            .filter((file) => file.endsWith(".md"))
            .map((file) => file.replace(".md", "")),
        ),
      ];
    } catch {
      return [locale, new Set()];
    }
  }),
);

const pageSize = 20;

/* 一覧のページ数。1ページ目は /blog が持つので、/blog/page/N は 2..totalPages */
function totalPages(locale) {
  return Math.max(1, Math.ceil(blogSlugs[locale].size / pageSize));
}

/* transform に渡る loc は /ja/... のように言語接頭辞が付いている。
   hreflang の組み立ては接頭辞の無い形で行うので、先に剥がす */
function stripLocale(loc) {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;

    if (loc === `/${locale}`) return "/";

    if (loc.startsWith(`/${locale}/`)) return loc.slice(locale.length + 1);
  }

  return loc;
}

function localesFor(loc) {
  const article = loc.match(/^\/blog\/(?!page\/)(.+)$/);

  if (article) {
    return locales.filter((locale) => blogSlugs[locale].has(article[1]));
  }

  const pager = loc.match(/^\/blog\/page\/(\d+)$/);

  if (pager) {
    const page = Number(pager[1]);

    return locales.filter((locale) => page <= totalPages(locale));
  }

  return locales;
}

function href(locale, loc) {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return `https://kkweb.io${prefix}${loc === "/" ? "" : loc}`;
}

/* 1つの言語しか無いページに hreflang を付けても意味がないので、
   2つ揃っているものだけに付ける */
function alternateRefs(loc) {
  const available = localesFor(loc);

  if (available.length < 2) return [];

  return [
    ...available.map((locale) => ({
      href: href(locale, loc),
      hreflang: locale,
      hrefIsAbsolute: true,
    })),
    {
      href: href(
        available.includes(defaultLocale) ? defaultLocale : available[0],
        loc,
      ),
      hreflang: "x-default",
      hrefIsAbsolute: true,
    },
  ];
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://kkweb.io/",
  generateRobotsTxt: true,
  exclude: ["/_next/*", "/*?dpl=*", "/*image", "/*staffs*"],

  // Next.js outputs English routes as /en/*, but runtime canonical is prefix-less.
  // Rewrite /en/* to /* so the sitemap matches the canonical URLs.
  transform: async (sitemapConfig, url) => {
    const rewritten = url === "/en" ? "/" : url.replace(/^\/en\//, "/");

    return {
      loc: rewritten,
      changefreq: sitemapConfig.changefreq,
      priority: sitemapConfig.priority,
      lastmod: sitemapConfig.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: alternateRefs(stripLocale(rewritten)),
    };
  },

  additionalPaths: async () => {
    const paths = [];
    const locales = ["en", "ja"];

    for (const locale of locales) {
      const dir = path.join(process.cwd(), "src/markdown-pages", locale);
      const urlPrefix = locale === "en" ? "" : `/${locale}`;

      try {
        const files = await fs.readdir(dir);

        for (const file of files) {
          if (!file.endsWith(".md")) continue;

          const slug = file.replace(".md", "");
          const filePath = path.join(dir, file);

          let lastmod;

          try {
            const fileContents = await fs.readFile(filePath, "utf8");
            const { metadata } = parseMD(fileContents);
            const rawDate =
              typeof metadata?.date === "string"
                ? metadata.date.replace(/[“”"']/g, "")
                : metadata?.date;

            if (rawDate) {
              const d = new Date(rawDate);

              if (!Number.isNaN(d.getTime())) {
                lastmod = d.toISOString();
              }
            }
          } catch (error) {
            console.error(`Error reading ${filePath}:`, error);
          }

          paths.push({
            loc: `${urlPrefix}/blog/${slug}`,
            changefreq: "daily",
            priority: 0.7,
            alternateRefs: alternateRefs(`/blog/${slug}`),
            ...(lastmod ? { lastmod } : {}),
          });
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    }

    return paths;
  },
};

export default config;
