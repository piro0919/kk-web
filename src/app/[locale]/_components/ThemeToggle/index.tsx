"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import styles from "./style.module.css";

export default function ThemeToggle(): null | React.JSX.Element {
  const t = useTranslations("Ui");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // サーバーでは配色が決まらないので、載ってから描く。
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={(): void => {
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={isDark ? t("themeToLight") : t("themeToDark")}
      className={styles.button}
      type="button"
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}
