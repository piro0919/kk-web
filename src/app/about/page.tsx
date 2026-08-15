import { type Metadata } from "next";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "ABOUT - kk-web",
};

const ITEMS = [
  { label: "Name", text: "Kouhei Kawamura" },
  { label: "Handle", text: "piro" },
  { label: "Address", text: "Tokyo, Japan" },
  { label: "Job", text: "CTO / Scrum Master / Software Developer" },
];

export default function Page(): React.JSX.Element {
  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.mat}>
          <div className={styles.panel}>
            <h1 className={styles.heading}>ABOUT</h1>
            <dl className={styles.list}>
              {ITEMS.map(({ label, text }) => (
                <div className={styles.item} key={label}>
                  <dt className={styles.label}>{label}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
