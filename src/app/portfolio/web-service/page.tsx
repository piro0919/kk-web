import getMetadata from "@/libs/getMetadata";
import WebService from "./_components/WebService";

export const metadata = getMetadata({
  path: "/portfolio/web-service",
  subTitle: "WEB SERVICE",
});

export default function Page(): React.JSX.Element {
  return <WebService />;
}
