import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import MenuList from "../_components/MenuList";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: toLocale(locale),
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
      <MenuList heading="WRITING" items={ITEMS} />
    </main>
  );
}
