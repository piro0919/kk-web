import getMetadata from "@/libs/getMetadata";
import {
  getStats,
  getTopBlogPages,
  getTopCountries,
  getTopReferrers,
} from "@/libs/umami";
import resolveLabels from "@/libs/umami/resolveLabels";
import { type Metadata } from "next";
import Stats from "./_components/Stats";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/stats",
    subTitle: "STATS",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;
  const days = 30;
  const [stats, topPagesRaw, referrers, countries] = await Promise.all([
    getStats(days),
    getTopBlogPages(locale as "en" | "ja", days, 10),
    getTopReferrers(days, 5),
    getTopCountries(days, 5),
  ]);
  const topPages = await resolveLabels(topPagesRaw);
  const endAt = Date.now();
  const startAt = endAt - days * 24 * 60 * 60 * 1000;

  return (
    <Stats
      countries={countries}
      days={days}
      endAt={endAt}
      locale={locale as "en" | "ja"}
      referrers={referrers}
      startAt={startAt}
      stats={stats}
      topPages={topPages}
    />
  );
}
