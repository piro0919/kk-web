import { useTranslations } from "next-intl";
import styles from "./style.module.css";

export default function WebService(): React.JSX.Element {
  const t = useTranslations("Portfolio.WebService");
  const items = [
    {
      href: "https://comictime.kkweb.io/",
      name: t("comictimeName"),
      text: t("comictimeText"),
    },
    {
      href: "https://ogpimggen.kkweb.io/",
      name: t("ogpimggenName"),
      text: t("ogpimggenText"),
    },
    {
      href: "https://peraichi.kkweb.io/",
      name: t("peraichiName"),
      text: t("peraichiText"),
    },
    {
      href: "https://youtube-growth.kkweb.io/",
      name: t("youtubeName"),
      text: t("youtubeText"),
    },
    {
      href: "https://kantanka.kkweb.io",
      name: t("kantankaName"),
      text: t("kantankaText"),
    },
    {
      href: "https://planning-poker.kkweb.io",
      name: t("pokerName"),
      text: t("pokerText"),
    },
    {
      href: "https://recban.kkweb.io",
      name: t("recbanName"),
      text: t("recbanText"),
    },
    {
      href: "https://omocoro-archive.kkweb.io",
      name: t("omocoroName"),
      text: t("omocoroText"),
    },
    {
      href: "https://omocoro-daily.kkweb.io",
      name: t("dailyName"),
      text: t("dailyText"),
    },
    {
      href: "https://siritori-timer.kkweb.io",
      name: t("siritoriName"),
      text: t("siritoriText"),
    },
    {
      href: "https://recigle.kkweb.io",
      name: t("recigleName"),
      text: t("recigleText"),
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
        <h1>WEB SERVICE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
