import { promises as fs } from "node:fs";
import path from "node:path";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://kkweb.io/",
  generateRobotsTxt: true,
  exclude: ["/_next/*", "/*?dpl=*", "/*image", "/*staffs*"],

  additionalPaths: async () => {
    const paths = [];
    const locales = ["en", "ja"];

    for (const locale of locales) {
      const dir = path.join(process.cwd(), "src/markdown-pages", locale);

      try {
        const files = await fs.readdir(dir);

        for (const file of files) {
          if (file.endsWith(".md")) {
            const slug = file.replace(".md", "");

            paths.push({
              loc: `/${locale}/blog/${slug}`,
              changefreq: "daily",
              priority: 0.7,
            });
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    }

    return paths;
  },
};

export default config;
