import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import Writing from "./_components/Writing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/writing",
    subTitle: "Writing",
  });
}

export default function Page(): React.JSX.Element {
  return <Writing />;
}
