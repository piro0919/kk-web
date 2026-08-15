"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./style.module.css";

const ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/writing", label: "WRITING" },
  { href: "/contact", label: "CONTACT" },
  { href: "/about", label: "ABOUT" },
] as const;

export default function Navigation(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        {ITEMS.map(({ href, label }) => (
          <li className={styles.item} key={href}>
            <Link
              className={`${styles.link} ${
                pathname === href ? styles.current : ""
              }`}
              href={href}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
