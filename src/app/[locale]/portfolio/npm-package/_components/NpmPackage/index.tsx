import { useTranslations } from "next-intl";
import { SocialIcon } from "react-social-icons";
import styles from "./style.module.css";

type Item = {
  href: string;
  name: string;
  repo?: string;
  text: string;
};

export default function NpmPackage(): React.JSX.Element {
  const t = useTranslations("Portfolio.Npm");
  const items = [
    {
      href: "https://www.npmjs.com/package/use-ear",
      name: "use-ear",
      repo: "https://github.com/piro0919/use-ear",
      text: t("useEarText"),
    },
    {
      href: "https://www.npmjs.com/package/use-right-click",
      name: "use-right-click",
      repo: "https://github.com/piro0919/use-right-click",
      text: t("useRightClickText"),
    },
    {
      href: "https://www.npmjs.com/package/next-subrouter",
      name: "next-subrouter",
      repo: "https://github.com/piro0919/next-subrouter",
      text: t("nextSubrouterText"),
    },
    {
      href: "https://www.npmjs.com/package/react-page-border",
      name: "react-page-border",
      repo: "https://github.com/piro0919/react-page-border",
      text: t("reactPageBorderText"),
    },
    {
      href: "https://www.npmjs.com/package/use-show-window-size",
      name: "use-show-window-size",
      repo: "https://github.com/piro0919/use-show-window-size",
      text: t("useShowWindowSizeText"),
    },
    {
      href: "https://www.npmjs.com/package/@piro0919/next-unused",
      name: "@piro0919/next-unused",
      repo: "https://github.com/piro0919/next-unused",
      text: t("nextUnusedText"),
    },
    {
      href: "https://www.npmjs.com/package/react-three-toggle",
      name: "react-three-toggle",
      repo: "https://github.com/piro0919/react-three-toggle",
      text: t("reactThreeToggleText"),
    },
    {
      href: "https://www.npmjs.com/package/react-comic-viewer",
      name: "react-comic-viewer",
      repo: "https://github.com/piro0919/react-comic-viewer",
      text: t("reactComicViewerText"),
    },
    {
      href: "https://www.npmjs.com/package/use-pwa",
      name: "use-pwa",
      repo: "https://github.com/piro0919/use-pwa",
      text: t("usePwaText"),
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
        <h1>NPM PACKAGE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
