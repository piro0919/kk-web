import getMetadata from "@/libs/getMetadata";
import { NPM_PACKAGES } from "@/libs/portfolio";
import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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
    path: "/portfolio/npm-package",
    subTitle: "NPM PACKAGE",
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
        category={NPM_PACKAGES}
        heading="NPM PACKAGE"
        locale={locale as "en" | "ja"}
      />
    </main>
  );
}
