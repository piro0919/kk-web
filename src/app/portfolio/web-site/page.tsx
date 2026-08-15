import { WEB_SITES } from "@/libs/portfolio";
import { type Metadata } from "next";
import CardList from "../../_components/CardList";

export const metadata: Metadata = {
  title: "WEB SITE - kk-web",
};

export default function Page(): React.JSX.Element {
  return (
    <main>
      <CardList heading="WEB SITE" items={WEB_SITES} />
    </main>
  );
}
