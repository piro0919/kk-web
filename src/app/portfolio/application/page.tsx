import getMetadata from "@/libs/getMetadata";
import Application from "./_components/Application";

export const metadata = getMetadata({
  path: "/portfolio/application",
  subTitle: "APPLICATION",
});

export default function Page(): React.JSX.Element {
  return <Application />;
}
