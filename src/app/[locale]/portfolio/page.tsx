import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import Portfolio from "./_components/Portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio",
    subTitle: "PORTFOLIO",
  });
}

export default function Page(): React.JSX.Element {
  return <Portfolio />;
}
