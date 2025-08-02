import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import WebService from "./_components/WebService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/web-service",
    subTitle: "WEB SERVICE",
  });
}

export default function Page(): React.JSX.Element {
  return <WebService />;
}
