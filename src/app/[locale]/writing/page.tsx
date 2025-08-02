import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import Writing from "./_components/Writing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/writing",
    subTitle: "Writing",
  });
}

export default function Page(): React.JSX.Element {
  return <Writing />;
}
