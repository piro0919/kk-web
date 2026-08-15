"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import styles from "./style.module.css";

export default function LocaleSwitch(): React.JSX.Element {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "en" ? "ja" : "en";

  return (
    <button
      onClick={(): void => {
        router.replace(pathname, { locale: next });
      }}
      aria-label={next === "ja" ? "日本語に切り替える" : "Switch to English"}
      className={styles.button}
      type="button"
    >
      {next.toUpperCase()}
    </button>
  );
}
