import styles from "./style.module.css";

export default function Frame(): React.JSX.Element {
  return (
    <div className={styles.frame}>
      <svg className={styles.border}>
        <rect className={styles.rect} height="100%" width="100%" />
      </svg>
    </div>
  );
}
