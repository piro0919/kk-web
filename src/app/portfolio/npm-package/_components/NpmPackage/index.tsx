import styles from "./style.module.css";

export default function NpmPackage(): JSX.Element {
  const items = [
    {
      href: "https://www.npmjs.com/package/react-page-border",
      name: "react-page-border",
      text: "画面全体にフチをつけるコンポーネントです。",
    },
    {
      href: "https://www.npmjs.com/package/use-show-window-size",
      name: "use-show-window-size",
      text: "画面右上にウィンドウサイズをリアルタイムで表示する独自フックです。",
    },
    {
      href: "https://www.npmjs.com/package/@piro0919/next-unused",
      name: "@piro0919/next-unused",
      text: "Next.js を使用したプロジェクト内で使用されていないコンポーネントファイルなどを洗い出すスクリプトです。",
    },
    {
      href: "https://www.npmjs.com/package/react-three-toggle",
      name: "react-three-toggle",
      text: "3 つ以上のスイッチを持つトグルボタン用のコンポーネントです。",
    },
    {
      href: "https://www.npmjs.com/package/react-comic-viewer",
      name: "react-comic-viewer",
      text: "画像などを見開きで閲覧できるコンポーネントです。",
    },
    {
      href: "https://www.npmjs.com/package/use-pwa",
      name: "use-pwa",
      text: "PWA の状態やインストール用の関数を渡す独自フックです。",
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
        <h2>NPM PACKAGE</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
