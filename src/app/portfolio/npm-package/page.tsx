import NpmPackage from "./_components/NpmPackage";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({
  path: "/portfolio/npm-package",
  subTitle: "NPM PACKAGE",
});

export default function Page(): JSX.Element {
  return <NpmPackage />;
}
