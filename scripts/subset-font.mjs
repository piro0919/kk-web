// JK ゴシック L を2つに割る。
//
// 1つの woff2 は 387KiB あり、ページの重さの6割を占めていた。ただ字を削ると
// 珍しい漢字が別の書体に落ちるので、削らずに unicode-range で分ける。
//   a: サイトの文章に出てくる字 + かな・英数・記号。どのページでも要る
//   b: 残りの字。珍しい漢字が本文に出たときだけ取りに行く
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
const SRC = path.join(root, "src/app/[locale]/jkg.woff2");
const OUT_DIR = path.join(root, "public/fonts");
const CSS_OUT = path.join(root, "src/app/[locale]/jkg-font.css");
const TS_OUT = path.join(root, "src/app/[locale]/jkgFont.ts");
const FAMILY = "JK Gothic L";

// 本文になりうるところ。ここに出る字を a に入れる。
const CONTENT_GLOBS = [
  "src/markdown-pages",
  "messages",
  "src/libs/portfolio/data.json",
  "src/app",
  "src/libs",
];
const TEXT_EXT = new Set([".md", ".json", ".ts", ".tsx", ".css"]);

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

const source = await readFile(SRC);
// 元の書体が持っている字を全部拾う。ここから漏らさずに2つへ配る。
const covered = new Set(createFont(source).characterSet);

const used = new Set();

for (const glob of CONTENT_GLOBS) {
  for (const file of await collectFiles(path.join(root, glob))) {
    const text = await readFile(file, "utf8").catch(() => "");

    for (const char of text) {
      const code = char.codePointAt(0);

      if (covered.has(code)) used.add(code);
    }
  }
}

const inA = new Set(
  [...covered].filter((code) => used.has(code) || isAlwaysIncluded(code)),
);
const inB = new Set([...covered].filter((code) => !inA.has(code)));

if (inB.size === 0) {
  throw new Error("b に回る字が無い。分ける意味が無いので設定を見直すこと");
}

const toText = (codes) =>
  [...codes].map((code) => String.fromCodePoint(code)).join("");

await rm(OUT_DIR, { force: true, recursive: true });
await mkdir(OUT_DIR, { recursive: true });

const written = {};

for (const [name, codes] of [
  ["a", inA],
  ["b", inB],
]) {
  const buffer = await subsetFont(source, toText(codes), {
    targetFormat: "woff2",
  });
  // 名前にハッシュを入れる。next.config.ts が woff2 を immutable にしているので、
  // 名前が変わらないと差し替えが届かない。
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
  const file = `jkg-${name}.${hash}.woff2`;

  await writeFile(path.join(OUT_DIR, file), buffer);

  written[name] = { file, size: buffer.length, url: `/fonts/${file}` };

  console.log(
    `${name}: ${codes.size} 字 ${(buffer.length / 1024).toFixed(0)} KiB ${file}`,
  );
}

const css = `/* pnpm font:subset が書き出す。手で直さない。 */
/* unicode-range の一覧が長く、csstree が判定を諦める。値は正しい。 */
/* stylelint-disable at-rule-descriptor-value-no-unknown */
@font-face {
  font-display: swap;
  font-family: "${FAMILY}";
  font-style: normal;
  font-weight: 400;
  src: url("${written.a.url}") format("woff2");
}

@font-face {
  font-display: swap;
  font-family: "${FAMILY}";
  font-style: normal;
  font-weight: 400;
  src: url("${written.b.url}") format("woff2");
  unicode-range: ${toRanges(inB)};
}
`;

await writeFile(CSS_OUT, css);

const ts = `// pnpm font:subset が書き出す。手で直さない。
// どのページでも要る方を先読みする。CSS を読み終わるまで待たせない。
const jkgFont = "${written.a.url}";

export default jkgFont;
`;

await writeFile(TS_OUT, ts);

console.log(
  `元: ${(source.length / 1024).toFixed(0)} KiB / いつものページ: ${(
    written.a.size / 1024
  ).toFixed(0)} KiB`,
);
