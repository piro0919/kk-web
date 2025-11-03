/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://kkweb.io/",
  generateRobotsTxt: true,

  // 全ブログ記事をサイトマップに追加
  additionalPaths: async () => {
    const fs = require("fs").promises;
    const path = require("path");
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

module.exports = config;
