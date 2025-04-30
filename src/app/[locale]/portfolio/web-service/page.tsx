import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import WebService from "./_components/WebService";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/web-service",
    subTitle: "WEB SERVICE",
  });
}

export default function Page(): React.JSX.Element {
  return <WebService />;
}
