"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { FiBookOpen, FiEdit3, FiHome, FiMail, FiUser } from "react-icons/fi";
import styles from "./style.module.css";

const ITEMS = [
  { href: "/", Icon: FiHome, label: "HOME", paths: ["/"] },
  {
    href: "/portfolio",
    Icon: FiBookOpen,
    label: "PORTFOLIO",
    paths: ["/portfolio"],
  },
  {
    href: "/writing",
    Icon: FiEdit3,
    label: "WRITING",
    paths: ["/writing", "/blog", "/note"],
  },
  { href: "/contact", Icon: FiMail, label: "CONTACT", paths: ["/contact"] },
  { href: "/about", Icon: FiUser, label: "ABOUT", paths: ["/about"] },
] as const;

export default function MobileMenu(): React.JSX.Element {
  const pathname = usePathname();
  // 下位のページに居ても親の項目を光らせる。/portfolio/movie なら PORTFOLIO。
  // HOME は "/" で始まる道筋が全部当たるので、完全一致だけ。
  const isCurrent = (paths: readonly string[]): boolean =>
    paths.some((path) =>
      path === "/" ? pathname === path : pathname.startsWith(path),
    );

  return (
    <nav className={styles.mobileMenu}>
      <ul className={styles.list}>
        {ITEMS.map(({ href, Icon, label, paths }) => (
          <li className={styles.item} key={href}>
            <Link
              className={`${styles.link} ${
                isCurrent(paths) ? styles.current : ""
              }`}
              href={href}
            >
              <Icon size={20} />
              <span className={styles.label}>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
