import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import Application from "./_components/Application";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/application",
    subTitle: "APPLICATION",
  });
}

export default function Page(): React.JSX.Element {
  return <Application />;
}
