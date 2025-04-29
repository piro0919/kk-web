import getMetadata from "@/libs/getMetadata";
import Movie from "./_components/Movie";

export const metadata = getMetadata({
  path: "/portfolio/movie",
  subTitle: "MOVIE",
});

export default function Page(): React.JSX.Element {
  return <Movie />;
}
