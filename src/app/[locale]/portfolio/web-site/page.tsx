import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import WebSite from "./_components/WebSite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/web-site",
    subTitle: "WEB SITE",
  });
}

export default function Page(): React.JSX.Element {
  return <WebSite />;
}
