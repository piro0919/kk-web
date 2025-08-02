import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import Contact from "./_components/Contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/contact",
    subTitle: "CONTACT",
  });
}

export default function Page(): React.JSX.Element {
  return <Contact />;
}
