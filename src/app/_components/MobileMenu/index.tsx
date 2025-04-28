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

export default function MobileMenu(): JSX.Element {
  const pathname = usePathname();
  const navLinks = useMemo(
    () =>
      navigations.map(({ href, title, ...navigation }, index) => {
        return (
          <div
            className={`${styles.item} ${montserrat.className}`}
            key={title}
            style={{
              borderLeft: index > 0 ? "1px solid var(--color-gray)" : undefined,
            }}
          >
            {"navigations" in navigation ? (
              <Menu
                align="center"
                arrow={true}
                direction="top"
                menuButton={<MenuButton>{title}</MenuButton>}
                theming="dark"
                transition={true}
              >
                {navigation.navigations.map(
                  ({ href: navigationHref, title }) => (
                    <MenuItem key={navigationHref}>
                      <Link href={`${href}${navigationHref}`}>{title}</Link>
                    </MenuItem>
                  ),
                )}
              </Menu>
            ) : (
              <Link className={styles.link} href={href}>
                <span
                  className={`${styles.label} ${
                    pathname === href ? styles.active : ""
                  }`}
                >
                  {title}
                </span>
              </Link>
            )}
          </div>
        );
      }),
    [pathname],
  );

  return <nav className={styles.nav}>{navLinks}</nav>;
}
