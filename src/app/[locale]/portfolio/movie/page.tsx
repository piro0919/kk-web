import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { getLocale } from "next-intl/server";
import Movie from "./_components/Movie";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/portfolio/movie",
    subTitle: "MOVIE",
  });
}

export default function Page(): React.JSX.Element {
  return <Movie />;
}
