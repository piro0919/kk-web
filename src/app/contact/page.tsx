import Contact from "./_components/Contact";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({ path: "/contact", subTitle: "CONTACT" });

export default function Page(): JSX.Element {
  return <Contact />;
}
