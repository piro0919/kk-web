import Movie from "./_components/Movie";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({
  path: "/portfolio/movie",
  subTitle: "MOVIE",
});

export default function Page(): JSX.Element {
  return <Movie />;
}
