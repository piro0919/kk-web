import styles from "./style.module.css";

export default function Movie(): JSX.Element {
  const items = [
    {
      href: "https://www.youtube.com/channel/UC--pDyTi3aPS5wf6PN6kXDA",
      name: "YouTube",
    },
    {
      href: "http://www.nicovideo.jp/mylist/30473930",
      name: "niconico",
    },
  ].map(({ href, name }) => (
    <a className={styles.link} href={href} key={name} target="_blank">
      <div className={styles.item}>
        <h3 className={styles.heading}>{name}</h3>
      </div>
    </a>
  ));

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h2>MOVIE</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
