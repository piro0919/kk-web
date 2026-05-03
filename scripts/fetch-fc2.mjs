import { writeFile } from "node:fs/promises";

const INDEX_URL = "http://piroshiki0919.blog116.fc2.com/?all";
const OUT = new URL("../src/libs/getFc2Articles/data.json", import.meta.url);
const CONCURRENCY = 16;
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

function parseIndex(html) {
  const entries = [];
  const liRe = /<li>([\s\S]*?)<\/li>/g;
  let m;
  while ((m = liRe.exec(html)) !== null) {
    const block = m[1];
    const dateMatch = /(\d{4})\/(\d{2})\/(\d{2})/.exec(block);
    const linkMatch =
      /&nbsp;([^&<]+)&nbsp;&nbsp;<a href="([^"]+blog-entry-\d+\.html)"/.exec(
        block,
      );
    if (!dateMatch || !linkMatch) continue;
    entries.push({
      date: `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`,
      title: decode(linkMatch[1]),
      url: linkMatch[2],
    });
  }
  return entries;
}

function extractExcerpt(html) {
  const bodyMatch =
    /<div class="entrybody" id="e\d+">([\s\S]*?)<div class="entrystate">/.exec(
      html,
    );
  if (!bodyMatch) return "";
  const body = bodyMatch[1];
  const textMatch =
    /<div class="entrytext">([\s\S]*?)(?:<div class="entrytext">|$)/.exec(body);
  const inner = textMatch ? textMatch[1] : "";
  const text = stripTags(inner);
  return text.slice(0, EXCERPT_LEN);
}

async function fetchExcerpt(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    const html = await res.text();
    return extractExcerpt(html);
  } catch {
    return "";
  }
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
        if (done % 50 === 0 || done === items.length) {
          process.stdout.write(`\r${done}/${items.length}`);
        }
      }
    }),
  );
  process.stdout.write("\n");
  return results;
}

async function main() {
  console.log("Fetching index...");
  const indexRes = await fetch(INDEX_URL);
  const indexHtml = await indexRes.text();
  const entries = parseIndex(indexHtml);
  console.log(`Found ${entries.length} entries`);

  console.log("Fetching excerpts...");
  const excerpts = await pool(entries, (e) => fetchExcerpt(e.url), CONCURRENCY);

  const enriched = entries.map((e, i) => ({ ...e, text: excerpts[i] }));

  await writeFile(OUT, JSON.stringify(enriched, null, 2) + "\n", "utf8");
  console.log(`Wrote ${enriched.length} entries to ${OUT.pathname}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
