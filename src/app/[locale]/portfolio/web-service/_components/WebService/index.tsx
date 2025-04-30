import { useTranslations } from "next-intl";
import styles from "./style.module.css";

export default function WebService(): React.JSX.Element {
  const t = useTranslations("Portfolio.WebService");
  const items = [
    {
      href: "https://youtube-growth.kk-web.link/",
      name: t("youtubeName"),
      text: t("youtubeText"),
    },
    {
      href: "https://kantanka.kk-web.link",
      name: t("kantankaName"),
      text: t("kantankaText"),
    },
    {
      href: "https://planning-poker.kk-web.link",
      name: t("pokerName"),
      text: t("pokerText"),
    },
    {
      href: "https://recban.kk-web.link",
      name: t("recbanName"),
      text: t("recbanText"),
    },
    {
      href: "https://omocoro-archive.kk-web.link",
      name: t("omocoroName"),
      text: t("omocoroText"),
    },
    {
      href: "https://omocoro-daily.kk-web.link",
      name: t("dailyName"),
      text: t("dailyText"),
    },
    {
      href: "https://siritori-timer.kk-web.link",
      name: t("siritoriName"),
      text: t("siritoriText"),
    },
    {
      href: "https://recigle.kk-web.link",
      name: t("recigleName"),
      text: t("recigleText"),
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
        <h2>WEB SERVICE</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
