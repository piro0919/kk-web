import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import NpmPackage from "./_components/NpmPackage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/npm-package",
    subTitle: "NPM PACKAGE",
  });
}

export default function Page(): React.JSX.Element {
  return <NpmPackage />;
}
