import { type Metadata } from "next";
import Link from "next/link";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "WRITING - kk-web",
};

const ITEMS = [
  { href: "/blog", label: "BLOG" },
  { href: "/note", label: "NOTE" },
] as const;

export default function Page(): React.JSX.Element {
  return (
    <main>
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          {ITEMS.map(({ href, label }) => (
            <li className={styles.item} key={href}>
              <Link className={styles.itemInner} href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
