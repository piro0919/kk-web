import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import FavoriteList from "../../_components/FavoriteList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: toLocale(locale),
    path: "/favorites/alcohol",
    subTitle: "ALCOHOL",
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <FavoriteList
        genre="ALCOHOL"
        heading="ALCOHOL"
        locale={toLocale(locale)}
      />
    </main>
  );
}
