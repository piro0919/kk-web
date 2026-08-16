"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import styles from "./style.module.css";

export default function LocaleSwitch(): React.JSX.Element {
  const locale = useLocale();
  // 読み上げ文字は切り替えた先の言葉で書く。今の言語のファイルに、
  // 切り替え先の言葉で入れてある。
  const t = useTranslations("Ui");
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "en" ? "ja" : "en";

  return (
    <button
      onClick={(): void => {
        router.replace(pathname, { locale: next });
      }}
      aria-label={t("switchLocale")}
      className={styles.button}
      type="button"
    >
      {next.toUpperCase()}
    </button>
  );
}
