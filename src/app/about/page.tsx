import About from "./_components/About";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({ path: "/about", subTitle: "ABOUT" });

export default function Page(): JSX.Element {
  return <About />;
}
