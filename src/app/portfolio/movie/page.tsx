import { MOVIES } from "@/libs/portfolio";
import { type Metadata } from "next";
import CardList from "../../_components/CardList";

export const metadata: Metadata = {
  title: "MOVIE - kk-web",
};

export default function Page(): React.JSX.Element {
  return (
    <main>
      <CardList heading="MOVIE" items={MOVIES} />
    </main>
  );
}
