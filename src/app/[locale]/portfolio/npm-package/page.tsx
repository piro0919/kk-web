import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import NpmPackage from "./_components/NpmPackage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/npm-package",
    subTitle: "NPM PACKAGE",
  });
}

export default function Page(): React.JSX.Element {
  return <NpmPackage />;
}
