import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { SocialIcon } from "react-social-icons";
import Spacer from "react-spacer";
import Switch from "react-switch";
import { useBoolean } from "usehooks-ts";
import styles from "./style.module.css";

export default function Footer(): React.JSX.Element {
  const links = ["https://github.com/piro0919", "https://x.com/piro0919"];
  const socialIcons = links.map((link) => (
    <SocialIcon
      fgColor="#fff"
      key={link}
      style={{ height: 36, width: 36 }}
      target="_blank"
      url={link}
    />
  ));
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setValue: setChecked, value: checked } = useBoolean(locale === "en");

  useEffect(() => {
    console.log("hoge", checked, locale);

    if ((checked && locale === "en") || (!checked && locale === "ja")) {
      return;
    }

    router.replace(pathname, {
      locale: checked ? "en" : "ja",
    });
  }, [checked, locale, pathname, router]);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.copyright}>&copy; 2018 kk-web</div>
        <Spacer grow={1} />
        <Switch
          checked={checked}
          checkedIcon={<div className={styles.switchIconContainer}>EN</div>}
          height={24}
          offColor="#b33e5c"
          onChange={(checked) => setChecked(checked)}
          onColor="#234794"
          uncheckedIcon={<div className={styles.switchIconContainer}>JA</div>}
          width={48}
        />
        <div className={styles.icons}>{socialIcons}</div>
      </div>
    </footer>
  );
}
