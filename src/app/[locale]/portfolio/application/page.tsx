import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import Application from "./_components/Application";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/application",
    subTitle: "APPLICATION",
  });
}

export default function Page(): React.JSX.Element {
  return <Application />;
}
