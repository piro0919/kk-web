import { type Metadata } from "next";
import ContactForm from "./_components/ContactForm";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "CONTACT - kk-web",
};

export default function Page(): React.JSX.Element {
  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.mat}>
          <div className={styles.panel}>
            <h1 className={styles.heading}>CONTACT</h1>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
