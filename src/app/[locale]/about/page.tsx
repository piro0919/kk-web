import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import About from "./_components/About";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/about",
    subTitle: "ABOUT",
  });
}

export default function Page(): React.JSX.Element {
  return <About />;
}
