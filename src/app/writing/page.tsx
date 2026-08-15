import { type Metadata } from "next";
import MenuList from "../_components/MenuList";

export const metadata: Metadata = {
  title: "WRITING - kk-web",
};

const ITEMS = [
  { href: "/blog", label: "BLOG" },
  { href: "/note", label: "NOTE" },
];

export default function Page(): React.JSX.Element {
  return (
    <main>
      <MenuList items={ITEMS} />
    </main>
  );
}
