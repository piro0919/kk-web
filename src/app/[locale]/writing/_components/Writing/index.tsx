import { Link } from "@/i18n/navigation";
import styles from "./style.module.css";

export default function Writing(): React.JSX.Element {
  const items = [
    {
      href: "/blog",
      name: "BLOG",
    },
    {
      href: "/note",
      name: "NOTE",
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
        <h1>WRITING</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
