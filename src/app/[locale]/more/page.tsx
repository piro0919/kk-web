import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import More from "./_components/More";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/more",
    subTitle: "MORE",
  });
}

export default function Page(): React.JSX.Element {
  return <More />;
}
