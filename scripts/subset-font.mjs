// 書体を2つに割る。
//
// 丸ごと1枚だと重く、かといって字を削ると珍しい漢字が別の書体に落ちる。
// 削らずに unicode-range で2つに分ける。割る仕事そのものは
// unicode-range-split がやる。ここに残っているのは、どの文章を数えるかだけ。
//
// 文章を足して新しい字が増えたら `pnpm font:subset` を流し直す。流さなくても
// rest から出るので表示は壊れない。
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { splitFont } from "unicode-range-split";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = path.join(root, "public/fonts");
const TEXT_EXT = new Set([".md", ".json", ".ts", ".tsx", ".css"]);

// 本文の書体が受け持つところ。サイトの文章ぜんぶ。
const BODY_SCAN = [
  "src/markdown-pages",
  "messages",
  "src/libs/portfolio/data.json",
  "src/app",
  "src/libs",
];

async function collectFiles(target) {
  const entries = await readdir(target, { withFileTypes: true }).catch(
    () => [],
  );

  if (entries.length === 0) return [target];

  const files = [];

  for (const entry of entries) {
    const full = path.join(target, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else if (TEXT_EXT.has(path.extname(entry.name))) {
      files.push(full);
    }
  }

  return files;
}

/** 記事の題名、作品名、画面の文言。見出し用の書体が実際に描くところ。 */
async function titleText() {
  let text = "";

  for (const locale of ["en", "ja"]) {
    const dir = path.join(root, "src/markdown-pages", locale);

    for (const file of await collectFiles(dir)) {
      const body = await readFile(file, "utf8").catch(() => "");
      const title = /^title:\s*"?(.*?)"?\s*$/m.exec(body);

      if (title) text += title[1];
    }
  }

  const portfolio = JSON.parse(
    await readFile(path.join(root, "src/libs/portfolio/data.json"), "utf8"),
  );

  for (const items of Object.values(portfolio)) {
    for (const item of items) {
      text += `${item.name}${item.nameJa ?? ""}`;
    }
  }

  for (const locale of ["en", "ja"]) {
    text += await readFile(
      path.join(root, "messages", `${locale}.json`),
      "utf8",
    );
  }

  return text;
}

const FONTS = [
  {
    css: "src/app/[locale]/jkg-font.css",
    family: "JK Gothic L",
    id: "jkg",
    outDir: OUT_DIR,
    // どのページでも要る方を先読みする。CSS を読み終わるまで待たせない。
    preload: "src/app/[locale]/jkgFont.ts",
    preloadName: "jkgFont",
    scan: BODY_SCAN.map((glob) => path.join(root, glob)),
    source: path.join(root, "src/app/[locale]/jkg.woff2"),
    weight: 400,
  },
  {
    css: "src/app/[locale]/zkgn-font.css",
    // 書体が届くまでのあいだ Arial を同じ寸法に見せる。これが無いと、
    // 差し替わった瞬間に題名の幅が変わって行がずれる。値は next/font が
    // 出していたものをそのまま引き継いだ。
    fallback: {
      ascent: "117%",
      descent: "29.05%",
      family: "Zen Kaku Gothic New Fallback",
      lineGap: "0.0%",
      local: "Arial",
      sizeAdjust: "99.15%",
    },
    family: "Zen Kaku Gothic New",
    id: "zkgn",
    outDir: OUT_DIR,
    // 記事の題名と作品名にしか当たらない。本文ぜんぶを入れると要らない字まで
    // 抱えるので、その2つと画面の文言だけを数える。NOTE の題名は note.com から
    // 来るので数えられないが、そこに出た珍しい字は rest から出る。
    text: titleText,
    source: path.join(root, "src/app/[locale]/zkgn.woff2"),
    weight: 700,
  },
];

// stylelint は unicode-range の長い一覧を読み切れず、判定を諦めたうえで
// 「知らない値」と言う。値は正しいので、書き出す側で黙らせる。
const HEADER = `/* pnpm font:subset が書き出す。手で直さない。 */
/* unicode-range の一覧が長く、csstree が判定を諦める。値は正しい。 */
/* stylelint-disable at-rule-descriptor-value-no-unknown */
`;

for (const { css, preload, preloadName, text, ...font } of FONTS) {
  const result = await splitFont({
    ...font,
    ...(text ? { text: await text() } : {}),
  });

  await writeFile(path.join(root, css), `${HEADER}${result.css}`);

  for (const [name, tier] of Object.entries(result.tiers)) {
    console.log(
      `${font.id}-${name}: ${tier.characters} 字 ${(tier.bytes / 1024).toFixed(0)} KiB ${tier.file}`,
    );
  }

  if (preload) {
    const ts = `// pnpm font:subset が書き出す。手で直さない。
// どのページでも要る方を先読みする。CSS を読み終わるまで待たせない。
const ${preloadName} = "${result.tiers.common.url}";

export default ${preloadName};
`;

    await writeFile(path.join(root, preload), ts);
  }

  console.log(
    `${font.id} 元: ${(result.source.bytes / 1024).toFixed(0)} KiB / いつものページ: ${(
      result.tiers.common.bytes / 1024
    ).toFixed(0)} KiB`,
  );
}
