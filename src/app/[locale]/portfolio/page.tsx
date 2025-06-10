import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import Portfolio from "./_components/Portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio",
    subTitle: "PORTFOLIO",
  });
}

export default function Page(): React.JSX.Element {
  return <Portfolio />;
}
