import { useTranslations } from "next-intl";
import { FiCoffee } from "react-icons/fi";
import styles from "./style.module.css";

const URL = "https://buymeacoffee.com/piro0919";

export default function SupportLink(): React.JSX.Element {
  const t = useTranslations("Ui");

  return (
    <a
      aria-label={t("support")}
      className={styles.link}
      href={URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FiCoffee size={18} />
    </a>
  );
}
