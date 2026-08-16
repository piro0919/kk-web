"use client";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./style.module.css";

const ITEMS = [
  { href: "/", label: "HOME", paths: ["/"] },
  { href: "/portfolio", label: "PORTFOLIO", paths: ["/portfolio"] },
  { href: "/writing", label: "WRITING", paths: ["/writing", "/blog", "/note"] },
  { href: "/contact", label: "CONTACT", paths: ["/contact"] },
  { href: "/about", label: "ABOUT", paths: ["/about"] },
] as const;

export default function Navigation(): React.JSX.Element {
  const pathname = usePathname();
  // 下位のページに居ても親の項目を光らせる。/portfolio/movie なら PORTFOLIO。
  // HOME は "/" で始まる道筋が全部当たるので、完全一致だけ。
  const isCurrent = (paths: readonly string[]): boolean =>
    paths.some((path) =>
      path === "/" ? pathname === path : pathname.startsWith(path),
    );

  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        {ITEMS.map(({ href, label, paths }) => (
          <li className={styles.item} key={href}>
            <Link
              className={`${styles.link} ${
                isCurrent(paths) ? styles.current : ""
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
