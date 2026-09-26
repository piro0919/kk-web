import { writeFile } from "node:fs/promises";

// Notion の Portfolio データベースを読み、src/libs/portfolio/data.json を丸ごと作り直す。
// 正本は Notion。data.json は手で直さず、これを走らせてコミットする。
// ビルドからは呼ばない。トークンは .env.local の NOTION_TOKEN から読む。

const DATA_SOURCE_ID = "3bd2c3b9-390c-80c2-8356-000bd7f0a476";
const NOTION_VERSION = "2025-09-03";
const OUT = new URL("../src/libs/portfolio/data.json", import.meta.url);
const CATEGORIES = [
  "WEB SERVICE",
  "WEB SITE",
  "APPLICATION",
  "NPM PACKAGE",
  "EXTENSION",
  "MOVIE",
];

const token = process.env.NOTION_TOKEN;

if (!token) {
  console.error("NOTION_TOKEN が .env.local にありません");
  process.exit(1);
}

async function queryAll() {
  const rows = [];
  let cursor;

  do {
    const res = await fetch(
      `https://api.notion.com/v1/data_sources/${DATA_SOURCE_ID}/query`,
      {
        body: JSON.stringify({ page_size: 100, start_cursor: cursor }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Notion-Version": NOTION_VERSION,
        },
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Notion API ${res.status}: ${await res.text()}`);
    }

    const body = await res.json();

    rows.push(...body.results);
    cursor = body.has_more ? body.next_cursor : undefined;
  } while (cursor);

  return rows;
}

function text(prop) {
  if (!prop) return undefined;

  switch (prop.type) {
    case "rich_text":
      return prop.rich_text.map((t) => t.plain_text).join("") || undefined;
    case "select":
      return prop.select?.name;
    case "title":
      return prop.title.map((t) => t.plain_text).join("") || undefined;
    case "url":
      return prop.url || undefined;
    default:
      throw new Error(`扱えない列の型です: ${prop.type}`);
  }
}

function toItem(p) {
  // キーはアルファベット順。空の列はキーごと出さない。
  const item = {
    altUrl: text(p["Alt URL"]),
    archived: p.Archived?.checkbox || undefined,
    descriptionEn: text(p["Description EN"]),
    descriptionJa: text(p["Description JA"]),
    lp: text(p.LP),
    name: text(p.Name),
    nameJa: text(p["Name JA"]),
    repo: text(p.Repo),
    url: text(p.URL),
  };

  return Object.fromEntries(
    Object.entries(item).filter(([, v]) => v !== undefined),
  );
}

const rows = await queryAll();
const grouped = Object.fromEntries(CATEGORIES.map((c) => [c, []]));

for (const row of rows) {
  const category = text(row.properties.Category);

  if (!(category in grouped)) {
    throw new Error(
      `カテゴリが不明な行があります: ${text(row.properties.Name)} (${category})`,
    );
  }

  // URL を空にした行は一覧から外したもの。公開前や一時的に下げた作品に使う。
  if (!text(row.properties.URL)) continue;

  grouped[category].push({
    item: toItem(row.properties),
    order: row.properties.Order?.number ?? Infinity,
  });
}

const data = Object.fromEntries(
  Object.entries(grouped).map(([c, list]) => [
    c,
    list.sort((a, b) => a.order - b.order).map(({ item }) => item),
  ]),
);

await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);

console.log(CATEGORIES.map((c) => `${c}: ${data[c].length}`).join(" / "));
