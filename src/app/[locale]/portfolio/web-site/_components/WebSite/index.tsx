import { useTranslations } from "next-intl";
import styles from "./style.module.css";

export default function WebSite(): React.JSX.Element {
  const t = useTranslations("Portfolio.WebSite");
  const items = [
    {
      href: "https://www.natsuzolab.com",
      name: t("natsuzolabName"),
      text: t("natsuzolabText"),
    },
    {
      href: "https://kanaohonten.vercel.app",
      name: t("kanaoName"),
      text: t("kanaoText"),
    },
    {
      href: "https://www.nbhyakuhati.com",
      name: t("seven08Name"),
      text: t("seven08Text"),
    },
    {
      href: "https://kontaniki.com",
      name: t("kontanikiName"),
      text: t("kontanikiText"),
    },
  ].map(({ href, name, text }) => (
    <a className={styles.link} href={href} key={name} target="_blank">
      <div className={styles.item}>
        <h2 className={styles.heading}>{name}</h2>
        <div className={styles.text}>{text}</div>
      </div>
    </a>
  ));

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h1>WEB SITE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
