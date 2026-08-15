import { NPM_PACKAGES } from "@/libs/portfolio";
import { type Metadata } from "next";
import CardList from "../../_components/CardList";

export const metadata: Metadata = {
  title: "NPM PACKAGE - kk-web",
};

export default function Page(): React.JSX.Element {
  return (
    <main>
      <CardList heading="NPM PACKAGE" items={NPM_PACKAGES} />
    </main>
  );
}
