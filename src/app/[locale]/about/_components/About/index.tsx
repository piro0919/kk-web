import styles from "./style.module.css";

export default function About(): React.JSX.Element {
  const items = [
    { name: "Name", text: "Kouhei Kawamura" },
    { name: "Handle", text: "piro" },
    { name: "Address", text: "Tokyo, Japan" },
    { name: "Job", text: "Frontend Developer " },
  ].map(({ name, text }) => (
    <div className={styles.item} key={name}>
      <div className={styles.label}>{name}</div>
      {typeof text === "string" ? <div>{text}</div> : text}
    </div>
  ));

  return (
    <>
      <div className={styles.srOnly}>
        <h1>ABOUT</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
