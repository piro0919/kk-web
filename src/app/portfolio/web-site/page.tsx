import WebSite from "./_components/WebSite";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({
  path: "/portfolio/web-site",
  subTitle: "WEB SITE",
});

export default function Page(): JSX.Element {
  return <WebSite />;
}
