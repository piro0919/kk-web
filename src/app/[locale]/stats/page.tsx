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
  const [stats, topPagesRaw, referrers, countries] = await Promise.all([
    getStats(30),
    getTopBlogPages(locale as "en" | "ja", 30, 10),
    getTopReferrers(30, 5),
    getTopCountries(30, 5),
  ]);
  const topPages = await resolveLabels(topPagesRaw);

  return (
    <Stats
      countries={countries}
      locale={locale as "en" | "ja"}
      referrers={referrers}
      stats={stats}
      topPages={topPages}
    />
  );
}
