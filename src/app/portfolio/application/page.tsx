import { APPLICATIONS } from "@/libs/portfolio";
import { type Metadata } from "next";
import CardList from "../../_components/CardList";

export const metadata: Metadata = {
  title: "APPLICATION - kk-web",
};

export default function Page(): React.JSX.Element {
  return (
    <main>
      <CardList heading="APPLICATION" items={APPLICATIONS} />
    </main>
  );
}
