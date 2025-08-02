import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import More from "./_components/More";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/more",
    subTitle: "MORE",
  });
}

export default function Page(): React.JSX.Element {
  return <More />;
}
