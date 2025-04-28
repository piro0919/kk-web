import styles from "./style.module.css";

export default function WebSite(): JSX.Element {
  const items = [
    {
      href: "https://lovvebox.com",
      name: "ラブボックス公式サイト",
      text: "VTuber プロダクション「ラブボックス」のサイトを作成しました。",
    },
    {
      href: "https://www.natsuzolab.com",
      name: "Natsuzolab",
      text: "作曲家「成田旬」さんのサイトを作成しました。",
    },
    {
      href: "https://kanaohonten.vercel.app",
      name: "金尾本店",
      text: "広島県福山市で営業している魚屋「金尾本店」のサイトを作成しました。",
    },
    {
      href: "https://www.nbhyakuhati.com",
      name: "7:08",
      text: "イラストレーター「7:08」さんのサイトを作成しました。",
    },
    {
      href: "https://kontaniki.com",
      name: "1stKontact",
      text: "イラストレーター「こんた」さんのサイトを作成しました。",
    },
  ].map(({ href, name, text }) => (
    <a className={styles.link} href={href} key={name} target="_blank">
      <div className={styles.item}>
        <h3 className={styles.heading}>{name}</h3>
        <div className={styles.text}>{text}</div>
      </div>
    </a>
  ));

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h2>WEB SITE</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
