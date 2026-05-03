import "server-only";
import env from "@/env";

export type UmamiStats = {
  bounces: number;
  comparison?: {
    bounces: number;
    pageviews: number;
    totaltime: number;
    visitors: number;
    visits: number;
  };
  pageviews: number;
  totaltime: number;
  visitors: number;
  visits: number;
};

export type UmamiMetric = {
  x: string;
  y: number;
};

const REVALIDATE_SECONDS = 3600;

async function umamiFetch<T>(
  path: string,
  searchParams: Record<string, string>,
): Promise<T> {
  const url = new URL(
    `${env.UMAMI_API_URL}/websites/${env.UMAMI_WEBSITE_ID}${path}`,
  );

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.UMAMI_API_KEY}`,
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Umami API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

function range(days: number): { endAt: string; startAt: string } {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;

  return {
    endAt: String(end),
    startAt: String(start),
  };
}

export async function getStats(days = 30): Promise<UmamiStats> {
  return umamiFetch<UmamiStats>("/stats", range(days));
}

export async function getTopPages(
  days = 30,
  limit = 10,
): Promise<UmamiMetric[]> {
  const data = await umamiFetch<UmamiMetric[]>("/metrics", {
    ...range(days),
    type: "url",
  });

  return data.slice(0, limit);
}

export async function getTopReferrers(
  days = 30,
  limit = 5,
): Promise<UmamiMetric[]> {
  const data = await umamiFetch<UmamiMetric[]>("/metrics", {
    ...range(days),
    type: "referrer",
  });

  return data.slice(0, limit);
}

export async function getTopCountries(
  days = 30,
  limit = 5,
): Promise<UmamiMetric[]> {
  const data = await umamiFetch<UmamiMetric[]>("/metrics", {
    ...range(days),
    type: "country",
  });

  return data.slice(0, limit);
}

function isBlogPath(p: string, locale: "en" | "ja"): boolean {
  if (locale === "ja") {
    return /^\/ja\/blog\/\d{8}$/.test(p);
  }

  return /^\/blog\/\d{8}$/.test(p);
}

function blogDate(p: string): string {
  return p.slice(-8);
}

export async function getTopBlogPages(
  locale: "en" | "ja",
  days = 30,
  limit = 10,
): Promise<UmamiMetric[]> {
  const data = await umamiFetch<UmamiMetric[]>("/metrics", {
    ...range(days),
    type: "url",
  });

  return data
    .filter((m) => isBlogPath(m.x, locale))
    .sort((a, b) => b.y - a.y || blogDate(b.x).localeCompare(blogDate(a.x)))
    .slice(0, limit);
}
