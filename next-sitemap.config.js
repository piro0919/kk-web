import { promises as fs } from "node:fs";
import path from "node:path";
import parseMD from "parse-md";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://kkweb.io/",
  generateRobotsTxt: true,
  exclude: ["/_next/*", "/*?dpl=*", "/*image"],

  additionalPaths: async () => {
    const paths = [];
    const dir = path.join(process.cwd(), "src/markdown-pages/ja");
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
        loc: `/blog/${slug}`,
        changefreq: "daily",
        priority: 0.7,
        ...(lastmod ? { lastmod } : {}),
      });
    }

    return paths;
  },
};

export default config;
