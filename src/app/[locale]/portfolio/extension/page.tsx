import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import getMetadata from "@/libs/getMetadata";
import CardList from "../../_components/CardList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/extension",
    subTitle: "EXTENSION",
  });
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <CardList
        category="EXTENSION"
        heading="EXTENSION"
        locale={locale as "en" | "ja"}
      />
    </main>
  );
}
