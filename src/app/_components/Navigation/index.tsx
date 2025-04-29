"use client";
import navigations from "@/libs/navigations";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import styles from "./style.module.css";

const montserrat = Montserrat({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
});

export default function Navigation(): React.JSX.Element {
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
            className={pathname === href ? styles.activeLink : undefined}
            href={href}
            key={title}
          >
            {title}
          </Link>
        ),
      ),
    [pathname],
  );

  return (
    <nav className={`${montserrat.className} ${styles.nav}`}>
      <div className={styles.inner}>
        <div className={styles.links}>{navLinks}</div>
      </div>
    </nav>
  );
}
