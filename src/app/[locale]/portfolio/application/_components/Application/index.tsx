import { useTranslations } from "next-intl";
import styles from "./style.module.css";

export default function Application(): React.JSX.Element {
  const t = useTranslations("Portfolio.Applications");
  const items = [
    {
      href: "https://macopy.kk-web.link/",
      name: "Macopy",
      text: t("macopyText"),
    },
    {
      href: "https://mcp.kk-web.link/",
      name: "Mac Classic Player",
      text: t("playerText"),
    },
  ].map(({ href, name, text }) => (
    <a className={styles.link} href={href} key={name} target="_blank">
      <div className={styles.item}>
        <h3 className={styles.heading}>{name}</h3>
        <div className={styles.text}>{text}</div>
      </div>
    </a>
  ));

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h2>APPLICATION</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
