import { useTranslations } from "next-intl";
import { SocialIcon } from "react-social-icons";
import styles from "./style.module.css";

type Item = {
  href: string;
  name: string;
  repo?: string;
  text: string;
};

export default function WebService(): React.JSX.Element {
  const t = useTranslations("Portfolio.WebService");
  const items = [
    {
      href: "https://high-low.kkweb.io/",
      name: t("highOrLowName"),
      repo: "https://github.com/piro0919/high-low",
      text: t("highOrLowText"),
    },
    {
      href: "https://comictime.kkweb.io/",
      name: t("comictimeName"),
      repo: "https://github.com/piro0919/comic-time",
      text: t("comictimeText"),
    },
    {
      href: "https://ogpimggen.kkweb.io/",
      name: t("ogpimggenName"),
      repo: "https://github.com/piro0919/ogp-image-generator",
      text: t("ogpimggenText"),
    },
    {
      href: "https://peraichi.kkweb.io/",
      name: t("peraichiName"),
      repo: "https://github.com/piro0919/peraichi",
      text: t("peraichiText"),
    },
    {
      href: "https://youtube-growth.kkweb.io/",
      name: t("youtubeName"),
      repo: "https://github.com/piro0919/youtube-growth",
      text: t("youtubeText"),
    },
    {
      href: "https://kantanka.kkweb.io",
      name: t("kantankaName"),
      repo: "https://github.com/piro0919/kantanka",
      text: t("kantankaText"),
    },
    {
      href: "https://planning-poker.kkweb.io",
      name: t("pokerName"),
      repo: "https://github.com/piro0919/planning-poker",
      text: t("pokerText"),
    },
    {
      href: "https://recban.kkweb.io",
      name: t("recbanName"),
      repo: "https://github.com/piro0919/recban",
      text: t("recbanText"),
    },
    {
      href: "https://omocoro-archive.kkweb.io",
      name: t("omocoroName"),
      repo: "https://github.com/piro0919/omocoro-archive",
      text: t("omocoroText"),
    },
    {
      href: "https://omocoro-daily.kkweb.io",
      name: t("dailyName"),
      repo: "https://github.com/piro0919/omocoro-dailyportalz",
      text: t("dailyText"),
    },
    {
      href: "https://siritori-timer.kkweb.io",
      name: t("siritoriName"),
      repo: "https://github.com/piro0919/siritori-timer",
      text: t("siritoriText"),
    },
    {
      href: "https://recigle.kkweb.io",
      name: t("recigleName"),
      repo: "https://github.com/piro0919/recigle",
      text: t("recigleText"),
    },
  ].map(({ href, name, repo, text }: Item) => (
    <div className={styles.row} key={name}>
      <a className={styles.link} href={href} target="_blank">
        <div className={styles.item}>
          <h2 className={styles.heading}>{name}</h2>
          <div className={styles.text}>{text}</div>
        </div>
      </a>
      {repo && (
        <SocialIcon
          className={styles.repoIcon}
          fgColor="#fff"
          style={{ height: 30, width: 30 }}
          target="_blank"
          url={repo}
        />
      )}
    </div>
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
