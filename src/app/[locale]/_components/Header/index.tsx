"use client";
import { Link, usePathname } from "@/i18n/navigation";
import navigations from "@/libs/navigations";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Montserrat } from "next/font/google";
import { useMemo } from "react";
import styles from "./style.module.css";

const montserrat = Montserrat({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
});

export default function Header(): React.JSX.Element {
  const pathname = usePathname();
  const { theme } = useTheme();
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
            theming={theme}
            transition={true}
          >
            {navigation.navigations.map(({ href: navigationHref, title }) => (
              <MenuItem key={navigationHref}>
                <Link href={navigationHref}>{title}</Link>
              </MenuItem>
            ))}
          </Menu>
        ) : (
          <Link
            style={
              pathname === href
                ? { borderBottom: "1px solid var(--color-danger)" }
                : undefined
            }
            href={href}
            key={title}
          >
            {title}
          </Link>
        ),
      ),
    [pathname, theme],
  );

  return (
    <header className={clsx(montserrat.className, styles.header)}>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>{navLinks}</div>
      </nav>
    </header>
  );
}
