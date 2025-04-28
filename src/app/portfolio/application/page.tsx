import Application from "./_components/Application";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({
  path: "/portfolio/application",
  subTitle: "APPLICATION",
});

export default function Page(): JSX.Element {
  return <Application />;
}
