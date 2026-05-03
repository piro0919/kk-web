import { useTranslations } from "next-intl";
import { SocialIcon } from "react-social-icons";
import styles from "./style.module.css";

type Item = {
  href: string;
  name: string;
  repo?: string;
  text: string;
};

export default function Application(): React.JSX.Element {
  const t = useTranslations("Portfolio.Applications");
  const items = [
    {
      href: "https://galopen.kkweb.io/",
      name: "Galopen",
      repo: "https://github.com/piro0919/galopen",
      text: t("galopenText"),
    },
    {
      href: "https://macopy.kkweb.io/",
      name: "Macopy",
      repo: "https://github.com/piro0919/macopy",
      text: t("macopyText"),
    },
    {
      href: "https://mcp.kkweb.io/",
      name: "Mac Classic Player",
      repo: "https://github.com/piro0919/mac-classic-player",
      text: t("playerText"),
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
        <h1>APPLICATION</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
