import { usePathname } from "@/i18n/navigation";
import links from "@/libs/links";
import NoSSR from "@mpth/react-no-ssr";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FaMoon, FaSun } from "react-icons/fa";
import { SocialIcon } from "react-social-icons";
import Spacer from "react-spacer";
import Switch from "react-switch";
import styles from "./style.module.css";

export default function Footer(): React.JSX.Element {
  const socialIcons = links.map((link) =>
    typeof link === "string" ? (
      <SocialIcon
        className={styles.iconLink}
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
  const { setTheme, theme } = useTheme();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.copyright}>&copy; 2018 kk-web</div>
        <Spacer grow={1} />
        <NoSSR>
          <Switch
            checkedIcon={
              <div className={styles.switchIconContainer}>
                <FaMoon size={12} />
              </div>
            }
            uncheckedIcon={
              <div className={styles.switchIconContainer}>
                <FaSun size={12} />
              </div>
            }
            checked={theme === "dark"}
            height={24}
            offColor="#b33e5c"
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
            onColor="#234794"
            width={48}
          />
        </NoSSR>
        <Switch
          onChange={(checked) => {
            const newLocale = checked ? "en" : "ja";

            if (locale === newLocale) return;

            // 強制的なページ遷移
            const newUrl = `/${newLocale}${pathname}`;

            window.location.href = newUrl;
          }}
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
