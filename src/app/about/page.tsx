import getMetadata from "@/libs/getMetadata";
import About from "./_components/About";

export const metadata = getMetadata({ path: "/about", subTitle: "ABOUT" });

export default function Page(): React.JSX.Element {
  return <About />;
}
