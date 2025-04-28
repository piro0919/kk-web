"use client";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import styles from "./style.module.css";
import navigations from "@/libs/navigations";

const montserrat = Montserrat({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
});

export default function Header(): JSX.Element {
  const pathname = usePathname();
  const navLinks = useMemo(
    () =>
      navigations.map(({ href, title, ...navigation }) =>
        "navigations" in navigation ? (
          <Menu
            align="center"
            arrow={true}
            direction="bottom"
            key={title}
            menuButton={<MenuButton>{title}</MenuButton>}
            theming="dark"
            transition={true}
          >
            {navigation.navigations.map(({ href: navigationHref, title }) => (
              <MenuItem key={navigationHref}>
                <Link href={`${href}${navigationHref}`}>{title}</Link>
              </MenuItem>
            ))}
          </Menu>
        ) : (
          <Link
            href={href}
            key={title}
            style={
              pathname === href
                ? { borderBottom: "1px solid var(--color-brand-red)" }
                : undefined
            }
          >
            {title}
          </Link>
        ),
      ),
    [pathname],
  );

  return (
    <header className={`${montserrat.className} ${styles.header}`}>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>{navLinks}</div>
      </nav>
    </header>
  );
}
