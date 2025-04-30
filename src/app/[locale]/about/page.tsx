import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import About from "./_components/About";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/about",
    subTitle: "ABOUT",
  });
}

export default function Page(): React.JSX.Element {
  return <About />;
}
