import { useTranslations } from "next-intl";
import { SocialIcon } from "react-social-icons";
import styles from "./style.module.css";

type Item = {
  href: string;
  name: string;
  repo?: string;
  text: string;
};

export default function WebSite(): React.JSX.Element {
  const t = useTranslations("Portfolio.WebSite");
  const items = [
    {
      href: "https://www.natsuzolab.com",
      name: t("natsuzolabName"),
      repo: "https://github.com/piro0919/natsuzolab",
      text: t("natsuzolabText"),
    },
    {
      href: "https://kanaohonten.vercel.app",
      name: t("kanaoName"),
      repo: "https://github.com/piro0919/kanao-honten",
      text: t("kanaoText"),
    },
    {
      href: "https://www.nbhyakuhati.com",
      name: t("seven08Name"),
      repo: "https://github.com/piro0919/708",
      text: t("seven08Text"),
    },
    {
      href: "https://konta-niki.com/",
      name: t("kontanikiName"),
      repo: "https://github.com/piro0919/1st-kontact",
      text: t("kontanikiText"),
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
        <h1>WEB SITE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
