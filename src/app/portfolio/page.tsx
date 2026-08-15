import { type Metadata } from "next";
import MenuList from "../_components/MenuList";

export const metadata: Metadata = {
  title: "PORTFOLIO - kk-web",
};

const ITEMS = [
  { href: "/portfolio/web-service", label: "WEB SERVICE" },
  { href: "/portfolio/web-site", label: "WEB SITE" },
  { href: "/portfolio/application", label: "APPLICATION" },
  { href: "/portfolio/npm-package", label: "NPM PACKAGE" },
  { href: "/portfolio/movie", label: "MOVIE" },
];

export default function Page(): React.JSX.Element {
  return (
    <main>
      <MenuList items={ITEMS} />
    </main>
  );
}
