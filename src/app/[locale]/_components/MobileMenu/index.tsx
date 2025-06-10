"use client";
import { Link, usePathname } from "@/i18n/navigation";
import mobileNavigations from "@/libs/mobileNavigations";
import clsx from "clsx";
import FeatherIcon from "feather-icons-react";
import { Montserrat } from "next/font/google";
import { useMemo } from "react";
import styles from "./style.module.css";

const montserrat = Montserrat({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
});

export default function MobileMenu(): React.JSX.Element {
  const pathname = usePathname();
  const navLinks = useMemo(
    () =>
      mobileNavigations.map(({ href, icon, title }) => {
        return (
          <div className={clsx(styles.item, montserrat.className)} key={title}>
            <Link
              className={clsx(styles.link, {
                [styles.active]: pathname === href,
              })}
              href={href}
            >
              <FeatherIcon icon={icon} size={21} strokeWidth={1} />
              <span className={styles.label}>{title}</span>
            </Link>
          </div>
        );
      }),
    [pathname],
  );

  return <nav className={styles.nav}>{navLinks}</nav>;
}
