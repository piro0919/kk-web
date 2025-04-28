import WebService from "./_components/WebService";
import getMetadata from "@/libs/getMetadata";

export const metadata = getMetadata({
  path: "/portfolio/web-service",
  subTitle: "WEB SERVICE",
});

export default function Page(): JSX.Element {
  return <WebService />;
}
