import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import Contact from "./_components/Contact";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/contact",
    subTitle: "CONTACT",
  });
}

export default function Page(): React.JSX.Element {
  return <Contact />;
}
