// 書体を2つに割る。
//
// 丸ごと1枚だと重く、かといって字を削ると珍しい漢字が別の書体に落ちる。
// 削らずに unicode-range で2つに分ける。
//   a: その書体が実際に受け持つ文章に出てくる字 + かな・英数・記号
//   b: 残りの字。珍しい漢字が出たときだけ取りに行く
// 字の網羅は元のままで、いつものページの転送量だけが減る。
//
// 文章を足して新しい字が増えたら `pnpm font:subset` を流し直す。流さなくても
// b から出るので表示は壊れない。
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { create as createFont } from "fontkit";
import subsetFont from "subset-font";

const root = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = path.join(root, "public/fonts");
const TEXT_EXT = new Set([".md", ".json", ".ts", ".tsx", ".css"]);

// 本文の書体。サイトの文章ぜんぶを受け持つ。
const BODY_GLOBS = [
  "src/markdown-pages",
  "messages",
  "src/libs/portfolio/data.json",
  "src/app",
  "src/libs",
];

const FONTS = [
  {
    css: "src/app/[locale]/jkg-font.css",
    family: "JK Gothic L",
    id: "jkg",
    // どのページでも要る方を先読みする。CSS を読み終わるまで待たせない。
    preload: "src/app/[locale]/jkgFont.ts",
    preloadName: "jkgFont",
    source: "src/app/[locale]/jkg.woff2",
    text: () => fromGlobs(BODY_GLOBS),
    weight: 400,
  },
  {
    css: "src/app/[locale]/zkgn-font.css",
    family: "Zen Kaku Gothic New",
    id: "zkgn",
    // 記事の題名と作品名にしか当たらない。本文ぜんぶを入れると要らない字まで
    // 抱えるので、その2つと画面の文言だけを数える。NOTE の題名は note.com から
    // 来るので数えられないが、そこに出た珍しい字は b から出る。
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
    source: "src/app/[locale]/zkgn.woff2",
    text: titleText,
    weight: 700,
  },
];

// 文章に出ていなくても a に入れる字。英数・約物・かな・全角形。
// 記事を1本足しただけで b を取りに行く、という形にならないようにする。
function isAlwaysIncluded(code) {
  return (
    code < 0x2100 ||
    (code >= 0x2500 && code < 0x2600) ||
    (code >= 0x3000 && code < 0x3100) ||
    (code >= 0xff00 && code < 0xfff0)
  );
}

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

async function fromGlobs(globs) {
  let text = "";

  for (const glob of globs) {
    for (const file of await collectFiles(path.join(root, glob))) {
      text += await readFile(file, "utf8").catch(() => "");
    }
  }

  return text;
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

function toRanges(codes) {
  const sorted = [...codes].sort((a, b) => a - b);
  const ranges = [];

  for (const code of sorted) {
    const last = ranges.at(-1);

    if (last && code === last[1] + 1) {
      last[1] = code;
    } else {
      ranges.push([code, code]);
    }
  }

  return ranges
    .map(([from, to]) => {
      const a = from.toString(16).toUpperCase();
      const b = to.toString(16).toUpperCase();

      return from === to ? `U+${a}` : `U+${a}-${b}`;
    })
    .join(",");
}

await mkdir(OUT_DIR, { recursive: true });

// 書き出した woff2 だけ捨てる。隣に置いた使用許諾は残す。
for (const file of await readdir(OUT_DIR).catch(() => [])) {
  if (file.endsWith(".woff2")) {
    await rm(path.join(OUT_DIR, file), { force: true });
  }
}

for (const font of FONTS) {
  const source = await readFile(path.join(root, font.source));
  // 元の書体が持っている字を全部拾う。ここから漏らさずに2つへ配る。
  const covered = new Set(createFont(source).characterSet);
  const used = new Set();

  for (const char of await font.text()) {
    const code = char.codePointAt(0);

    if (covered.has(code)) used.add(code);
  }

  const inA = new Set(
    [...covered].filter((code) => used.has(code) || isAlwaysIncluded(code)),
  );
  const inB = new Set([...covered].filter((code) => !inA.has(code)));

  if (inB.size === 0) {
    throw new Error(
      `${font.id}: b に回る字が無い。分ける意味が無いので設定を見直すこと`,
    );
  }

  const written = {};

  for (const [name, codes] of [
    ["a", inA],
    ["b", inB],
  ]) {
    const text = [...codes].map((code) => String.fromCodePoint(code)).join("");
    const buffer = await subsetFont(source, text, { targetFormat: "woff2" });
    // 名前にハッシュを入れる。next.config.ts が woff2 を immutable にしているので、
    // 名前が変わらないと差し替えが届かない。
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
    const file = `${font.id}-${name}.${hash}.woff2`;

    await writeFile(path.join(OUT_DIR, file), buffer);

    written[name] = { file, size: buffer.length, url: `/fonts/${file}` };

    console.log(
      `${font.id}-${name}: ${codes.size} 字 ${(buffer.length / 1024).toFixed(0)} KiB ${file}`,
    );
  }

  const css = `/* pnpm font:subset が書き出す。手で直さない。 */
/* unicode-range の一覧が長く、csstree が判定を諦める。値は正しい。 */
/* stylelint-disable at-rule-descriptor-value-no-unknown */
@font-face {
  font-display: swap;
  font-family: "${font.family}";
  font-style: normal;
  font-weight: ${font.weight};
  src: url("${written.a.url}") format("woff2");
}

@font-face {
  font-display: swap;
  font-family: "${font.family}";
  font-style: normal;
  font-weight: ${font.weight};
  src: url("${written.b.url}") format("woff2");
  unicode-range: ${toRanges(inB)};
}
${
  font.fallback
    ? `
@font-face {
  ascent-override: ${font.fallback.ascent};
  descent-override: ${font.fallback.descent};
  font-family: "${font.fallback.family}";
  line-gap-override: ${font.fallback.lineGap};
  size-adjust: ${font.fallback.sizeAdjust};
  src: local(${font.fallback.local});
}
`
    : ""
}`;

  await writeFile(path.join(root, font.css), css);

  if (font.preload) {
    const ts = `// pnpm font:subset が書き出す。手で直さない。
// どのページでも要る方を先読みする。CSS を読み終わるまで待たせない。
const ${font.preloadName} = "${written.a.url}";

export default ${font.preloadName};
`;

    await writeFile(path.join(root, font.preload), ts);
  }

  console.log(
    `${font.id} 元: ${(source.length / 1024).toFixed(0)} KiB / いつものページ: ${(
      written.a.size / 1024
    ).toFixed(0)} KiB`,
  );
}
