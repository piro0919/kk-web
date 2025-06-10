import { Link } from "@/i18n/navigation";
import styles from "./style.module.css";

export default function Portfolio(): React.JSX.Element {
  const items = [
    {
      href: "/portfolio/web-service",
      name: "WEB SERVICE",
    },
    {
      href: "/portfolio/web-site",
      name: "WEB SITE",
    },
    {
      href: "/portfolio/application",
      name: "APPLICATION",
    },
    {
      href: "/portfolio/npm-package",
      name: "NPM PACKAGE",
    },
    {
      href: "/portfolio/movie",
      name: "MOVIE",
    },
  ].map(({ href, name }) => (
    <Link className={styles.link} href={href} key={name}>
      <div className={styles.item}>
        <h2 className={styles.heading}>{name}</h2>
      </div>
    </Link>
  ));

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h1>PORTFOLIO</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
