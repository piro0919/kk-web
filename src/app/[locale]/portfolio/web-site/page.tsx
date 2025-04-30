import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import WebSite from "./_components/WebSite";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/web-site",
    subTitle: "WEB SITE",
  });
}

export default function Page(): React.JSX.Element {
  return <WebSite />;
}
