"use client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import links from "@/libs/links";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { SocialIcon } from "react-social-icons";
import Switch from "react-switch";
import { useBoolean } from "usehooks-ts";
import styles from "./style.module.css";

export default function More(): React.JSX.Element {
  const items = [
    {
      href: "/contact",
      name: "CONTACT",
    },
    {
      href: "/about",
      name: "ABOUT",
    },
  ].map(({ href, name }) => (
    <Link className={styles.link} href={href} key={name}>
      <div className={styles.item}>
        <h2 className={styles.heading}>{name}</h2>
      </div>
    </Link>
  ));
  const socialIcons = links.map((link) =>
    typeof link === "string" ? (
      <SocialIcon
        fgColor="#fff"
        key={link}
        style={{ height: 36, width: 36 }}
        target="_blank"
        url={link}
      />
    ) : (
      <a
        className={styles.iconLink}
        href={link.url}
        key={link.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image alt="" height={36} quality={100} src={link.path} width={36} />
      </a>
    ),
  );
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setValue: setChecked, value: checked } = useBoolean(locale === "en");

  useEffect(() => {
    if ((checked && locale === "en") || (!checked && locale === "ja")) {
      return;
    }

    router.replace(pathname, {
      locale: checked ? "en" : "ja",
    });
  }, [checked, locale, pathname, router]);

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h1>MORE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {items}
          <div className={styles.item}>
            <h2 className={styles.heading}>LOCALE</h2>
            <Switch
              uncheckedIcon={
                <div className={styles.switchIconContainer}>JA</div>
              }
              checked={checked}
              checkedIcon={<div className={styles.switchIconContainer}>EN</div>}
              height={24}
              offColor="#b33e5c"
              onChange={(checked) => setChecked(checked)}
              onColor="#234794"
              width={48}
            />
          </div>
          <div className={styles.item}>
            <h2 className={styles.heading}>LINK</h2>
            <div className={styles.icons}>{socialIcons}</div>
          </div>
        </div>
      </div>
    </>
  );
}
