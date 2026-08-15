"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBookOpen, FiEdit3, FiHome, FiMail, FiUser } from "react-icons/fi";
import styles from "./style.module.css";

const ITEMS = [
  { href: "/", Icon: FiHome, label: "HOME" },
  { href: "/portfolio", Icon: FiBookOpen, label: "PORTFOLIO" },
  { href: "/writing", Icon: FiEdit3, label: "WRITING" },
  { href: "/contact", Icon: FiMail, label: "CONTACT" },
  { href: "/about", Icon: FiUser, label: "ABOUT" },
] as const;

export default function MobileMenu(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileMenu}>
      <ul className={styles.list}>
        {ITEMS.map(({ href, Icon, label }) => (
          <li className={styles.item} key={href}>
            <Link
              className={`${styles.link} ${
                pathname === href ? styles.current : ""
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
