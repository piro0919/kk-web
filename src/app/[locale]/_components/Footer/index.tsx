import { usePathname, useRouter } from "@/i18n/navigation";
import links from "@/libs/links";
import { useLocale } from "next-intl";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import Spacer from "react-spacer";
import Switch from "react-switch";
import styles from "./style.module.css";

export default function Footer(): React.JSX.Element {
  const socialIcons = links.map((link) =>
    typeof link === "string" ? (
      <SocialIcon
        fgColor="#fff"
        key={link}
        style={{ height: 30, width: 30 }}
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
        <Image alt="" height={30} quality={100} src={link.path} width={30} />
      </a>
    ),
  );
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.copyright}>&copy; 2018 kk-web</div>
        <Spacer grow={1} />
        <Switch
          onChange={(checked) =>
            router.replace(pathname, {
              locale: checked ? "en" : "ja",
            })
          }
          checked={locale === "en"}
          checkedIcon={<div className={styles.switchIconContainer}>EN</div>}
          height={24}
          offColor="#b33e5c"
          onColor="#234794"
          uncheckedIcon={<div className={styles.switchIconContainer}>JA</div>}
          width={48}
        />
        <div className={styles.icons}>{socialIcons}</div>
      </div>
    </footer>
  );
}
