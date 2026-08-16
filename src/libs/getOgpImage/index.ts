const TIMEOUT_MS = 6000;

/** 相対パスの og:image を絶対 URL に直す。 */
function toAbsolute(url: string, base: string): null | string {
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

function extractOgImage(html: string): null | string {
  const match =
    /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i.exec(
      html,
    ) ??
    /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i.exec(
      html,
    );

  return match ? match[1] : null;
}

async function probe(url: string, init: RequestInit): Promise<null | Response> {
  return Promise.race([
    fetch(url, { ...init, next: { revalidate: 86400 } }),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), TIMEOUT_MS)),
  ]);
}

/**
 * og:image が実際に画像として開けるか確かめ、最終的な URL を返す。
 * 旧ドメインを指したまま、301 で画像ではないページへ飛ぶことがある。
 */
async function resolveImage(url: string): Promise<null | string> {
  try {
    let response = await probe(url, { method: "HEAD" });

    // ニコニコの配信元のように HEAD を 415 で断るところがある。
    // その場合は先頭 1 バイトだけ取って種類を確かめる。
    if (!response?.ok) {
      response = await probe(url, {
        headers: { range: "bytes=0-0" },
        method: "GET",
      });
    }

    if (!response?.ok) {
      return null;
    }

    const type = response.headers.get("content-type") ?? "";

    return type.startsWith("image/") ? response.url : null;
  } catch {
    return null;
  }
}

/** 動画の置き場ごとに、絵の URL を直に組み立てる。 */
const VIDEO_SOURCES: {
  candidates: (id: string) => string[];
  match: RegExp;
}[] = [
  {
    // 大きいほうが無い古い動画があるので、順に当てる。
    candidates: (id) => [
      `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    ],
    match: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
  },
  {
    candidates: (id) => [
      `https://nicovideo.cdn.nimg.jp/thumbnails/${id}/${id}.L`,
      `https://nicovideo.cdn.nimg.jp/thumbnails/${id}/${id}`,
    ],
    match: /nicovideo\.jp\/watch\/[a-z]{2}(\d+)/,
  },
];

/**
 * 動画は配信元の絵を直に指す。ページを読みに行くと、その時々の混み具合や
 * 読みに行った場所によって断られることがあり、実際に本番だけ絵が欠けていた。
 * 番号から組み立てれば、そこは揺れない。
 */
async function getVideoThumbnail(url: string): Promise<null | string> {
  for (const { candidates, match } of VIDEO_SOURCES) {
    const id = match.exec(url)?.[1];

    if (id === undefined) continue;

    for (const candidate of candidates(id)) {
      const resolved = await resolveImage(candidate);

      if (resolved !== null) return resolved;
    }
  }

  return null;
}

/**
 * ページの og:image を取り出す。取れなければ null。
 * 外部サイト頼みなので、必ず時間で打ち切る。取得は24時間ごと。
 */
export default async function getOgpImage(url: string): Promise<null | string> {
  try {
    const video = await getVideoThumbnail(url);

    if (video !== null) return video;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, TIMEOUT_MS);
    // Next のキャッシュ付き fetch が signal を無視することがあるので、
    // 時間切れ側も併走させて必ず抜ける。
    const response = await Promise.race([
      fetch(url, {
        headers: { "user-agent": "kk-web/1.0 (+https://kkweb.io)" },
        next: { revalidate: 86400 },
        signal: controller.signal,
      }),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), TIMEOUT_MS),
      ),
    ]);

    clearTimeout(timeout);

    if (!response || !response.ok) {
      return null;
    }

    const html = await response.text();
    const image = extractOgImage(html);
    const absolute = image ? toAbsolute(image, url) : null;

    return absolute === null ? null : await resolveImage(absolute);
  } catch {
    return null;
  }
}
