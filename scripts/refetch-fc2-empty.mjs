import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../src/libs/getFc2Articles/data.json", import.meta.url);
const CONCURRENCY = 4;
const EXCERPT_LEN = 200;

function decode(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function stripTags(html) {
  return decode(html.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function extractExcerpt(html) {
  const bodyMatch =
    /<div class="entrybody" id="e\d+">([\s\S]*?)<div class="entrystate">/.exec(
      html,
    );
  if (!bodyMatch) return "";
  const body = bodyMatch[1];
  const blocks = [];
  const re =
    /<div class="entrytext">([\s\S]*?)<\/div>\s*(?=<div class="entry|$)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const t = stripTags(m[1]);
    if (t) blocks.push(t);
  }
  return blocks.join(" ").slice(0, EXCERPT_LEN);
}

async function fetchExcerpt(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const html = await res.text();
        const text = extractExcerpt(html);
        if (text) return text;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  return "";
}

async function pool(items, worker, concurrency) {
  const results = new Array(items.length);
  let i = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (true) {
        const idx = i++;
        if (idx >= items.length) break;
        results[idx] = await worker(items[idx], idx);
        done++;
        process.stdout.write(`\r${done}/${items.length}`);
      }
    }),
  );
  process.stdout.write("\n");
  return results;
}

async function main() {
  const data = JSON.parse(await readFile(FILE, "utf8"));
  const emptyIdxs = data
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !d.text)
    .map(({ i }) => i);

  console.log(`Refetching ${emptyIdxs.length} empty entries...`);
  const texts = await pool(
    emptyIdxs,
    (idx) => fetchExcerpt(data[idx].url),
    CONCURRENCY,
  );

  let recovered = 0;
  emptyIdxs.forEach((idx, i) => {
    if (texts[i]) {
      data[idx].text = texts[i];
      recovered++;
    }
  });

  await writeFile(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Recovered ${recovered}/${emptyIdxs.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
