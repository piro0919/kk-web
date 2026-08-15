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
    path: "/writing",
    subTitle: "WRITING",
  });
}

const ITEMS = [
  { href: "/blog", label: "BLOG" },
  { href: "/note", label: "NOTE" },
];

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <MenuList items={ITEMS} />
    </main>
  );
}
