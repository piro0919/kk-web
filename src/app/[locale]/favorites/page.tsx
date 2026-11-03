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
    path: "/favorites",
    subTitle: "FAVORITES",
  });
}

const ITEMS = [
  { href: "/favorites/manga", label: "MANGA" },
  { href: "/favorites/alcohol", label: "ALCOHOL" },
  { href: "/favorites/gadget", label: "GADGET" },
];

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <MenuList heading="FAVORITES" items={ITEMS} />
    </main>
  );
}
