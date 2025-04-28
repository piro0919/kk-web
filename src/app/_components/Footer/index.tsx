import { SocialIcon } from "react-social-icons";
import styles from "./style.module.css";
import links from "@/libs/links";

export default function Footer(): JSX.Element {
  const socialIcons = links.map((link) => (
    <SocialIcon
      fgColor="#fff"
      key={link}
      style={{ height: 36, width: 36 }}
      target="_blank"
      url={link}
    />
  ));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.copyright}>&copy; 2018 kk-web</div>
        <div className={styles.icons}>{socialIcons}</div>
      </div>
    </footer>
  );
}
