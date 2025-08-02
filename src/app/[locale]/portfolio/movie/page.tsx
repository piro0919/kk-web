import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import Movie from "./_components/Movie";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/movie",
    subTitle: "MOVIE",
  });
}

export default function Page(): React.JSX.Element {
  return <Movie />;
}
