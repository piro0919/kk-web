import { promises as fs } from "node:fs";
import path from "node:path";
import parseMD from "parse-md";

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
