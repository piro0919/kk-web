import { useLocale } from "next-intl";
import { FiCoffee } from "react-icons/fi";
import styles from "./style.module.css";

const URL = "https://buymeacoffee.com/piro0919";

export default function SupportLink(): React.JSX.Element {
  const locale = useLocale();

  return (
    <a
      aria-label={
        locale === "ja"
          ? "Buy Me a Coffee で支援する"
          : "Support me on Buy Me a Coffee"
      }
      className={styles.link}
      href={URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FiCoffee size={18} />
    </a>
  );
}
