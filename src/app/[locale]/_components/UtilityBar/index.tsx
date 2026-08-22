import LocaleSwitch from "../LocaleSwitch";
import SupportLink from "../SupportLink";
import ThemeToggle from "../ThemeToggle";
import styles from "./style.module.css";

export default function UtilityBar(): React.JSX.Element {
  return (
    // 左から並ぶとおりに書いて、Tab の移動順を合わせる。
    <div className={styles.bar}>
      <SupportLink />
      <LocaleSwitch />
      <ThemeToggle />
    </div>
  );
}
