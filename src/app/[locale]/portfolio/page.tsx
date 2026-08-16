import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import MenuList from "../_components/MenuList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio",
    subTitle: "PORTFOLIO",
  });
}

const ITEMS = [
  { href: "/portfolio/web-service", label: "WEB SERVICE" },
  { href: "/portfolio/web-site", label: "WEB SITE" },
  { href: "/portfolio/application", label: "APPLICATION" },
  { href: "/portfolio/npm-package", label: "NPM PACKAGE" },
  { href: "/portfolio/extension", label: "EXTENSION" },
  { href: "/portfolio/movie", label: "MOVIE" },
];

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <MenuList heading="PORTFOLIO" items={ITEMS} />
    </main>
  );
}
