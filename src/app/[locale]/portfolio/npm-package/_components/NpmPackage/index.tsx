import { useTranslations } from "next-intl";
import styles from "./style.module.css";

export default function NpmPackage(): React.JSX.Element {
  const t = useTranslations("Portfolio.Npm");
  const items = [
    {
      href: "https://www.npmjs.com/package/next-subrouter",
      name: "next-subrouter",
      text: t("nextSubrouterText"),
    },
    {
      href: "https://www.npmjs.com/package/react-page-border",
      name: "react-page-border",
      text: t("reactPageBorderText"),
    },
    {
      href: "https://www.npmjs.com/package/use-show-window-size",
      name: "use-show-window-size",
      text: t("useShowWindowSizeText"),
    },
    {
      href: "https://www.npmjs.com/package/@piro0919/next-unused",
      name: "@piro0919/next-unused",
      text: t("nextUnusedText"),
    },
    {
      href: "https://www.npmjs.com/package/react-three-toggle",
      name: "react-three-toggle",
      text: t("reactThreeToggleText"),
    },
    {
      href: "https://www.npmjs.com/package/react-comic-viewer",
      name: "react-comic-viewer",
      text: t("reactComicViewerText"),
    },
    {
      href: "https://www.npmjs.com/package/use-pwa",
      name: "use-pwa",
      text: t("usePwaText"),
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
        <h1>NPM PACKAGE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
