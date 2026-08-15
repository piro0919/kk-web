import { WEB_SERVICES } from "@/libs/portfolio";
import { type Metadata } from "next";
import CardList from "../../_components/CardList";

export const metadata: Metadata = {
  title: "WEB SERVICE - kk-web",
};

export default function Page(): React.JSX.Element {
  return (
    <main>
      <CardList heading="WEB SERVICE" items={WEB_SERVICES} />
    </main>
  );
}
