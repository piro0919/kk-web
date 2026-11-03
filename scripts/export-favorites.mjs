import { writeFile } from "node:fs/promises";

// Notion の Favorites データベースを読み、src/libs/favorites/data.json を丸ごと作り直す。
// 正本は Notion。data.json は手で直さず、これを走らせてコミットする。
// ビルドからは呼ばない。トークンは .env.local の NOTION_TOKEN から読む。

const DATA_SOURCE_ID = "a007813a-bdad-4cac-a542-6b364eca1da6";
const NOTION_VERSION = "2025-09-03";
const OUT = new URL("../src/libs/favorites/data.json", import.meta.url);
const GENRES = ["MANGA", "ALCOHOL", "GADGET"];
const LIMIT = 9;

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
    descriptionEn: text(p["英語の説明"]),
    descriptionJa: text(p["日本語の説明"]),
    image: text(p["画像"]),
    name: text(p["名前"]),
    nameJa: text(p["日本語名"]),
    url: text(p.URL),
  };

  return Object.fromEntries(
    Object.entries(item).filter(([, v]) => v !== undefined),
  );
}

const rows = await queryAll();
const grouped = Object.fromEntries(GENRES.map((g) => [g, []]));

for (const row of rows) {
  // URL を空にした行は一覧から外したもの。書きかけの品に使う。
  if (!text(row.properties.URL)) continue;

  const genre = text(row.properties["ジャンル"]);

  if (!(genre in grouped)) {
    throw new Error(
      `ジャンルが不明な行があります: ${text(row.properties["名前"])} (${genre})`,
    );
  }

  grouped[genre].push({
    item: toItem(row.properties),
    order: row.properties["並び順"]?.number ?? Infinity,
  });
}

const over = GENRES.filter((g) => grouped[g].length > LIMIT);

if (over.length > 0) {
  throw new Error(
    `${LIMIT}件を超えたジャンルがあります: ${over.map((g) => `${g} ${grouped[g].length}件`).join(" / ")}`,
  );
}

const data = Object.fromEntries(
  Object.entries(grouped).map(([g, list]) => [
    g,
    list.sort((a, b) => a.order - b.order).map(({ item }) => item),
  ]),
);

await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`);

console.log(GENRES.map((g) => `${g}: ${data[g].length}`).join(" / "));
