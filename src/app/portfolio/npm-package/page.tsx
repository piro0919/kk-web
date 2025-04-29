import getMetadata from "@/libs/getMetadata";
import NpmPackage from "./_components/NpmPackage";

export const metadata = getMetadata({
  path: "/portfolio/npm-package",
  subTitle: "NPM PACKAGE",
});

export default function Page(): React.JSX.Element {
  return <NpmPackage />;
}
