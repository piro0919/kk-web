import getMetadata from "@/libs/getMetadata";
import WebSite from "./_components/WebSite";

export const metadata = getMetadata({
  path: "/portfolio/web-site",
  subTitle: "WEB SITE",
});

export default function Page(): React.JSX.Element {
  return <WebSite />;
}
