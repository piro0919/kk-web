import getMetadata from "@/libs/getMetadata";
import Contact from "./_components/Contact";

export const metadata = getMetadata({ path: "/contact", subTitle: "CONTACT" });

export default function Page(): React.JSX.Element {
  return <Contact />;
}
