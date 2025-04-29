import styles from "./style.module.css";

export default function WebService(): React.JSX.Element {
  const items = [
    {
      href: "https://youtube-growth.kk-web.link/",
      name: "YouTube Growth",
      text: "YouTubeチャンネルを解析しアドバイスしてくれるサービスです。",
    },
    {
      href: "https://kantanka.kk-web.link",
      name: "かんたんか",
      text: "短歌が投稿できるサービスです。",
    },
    {
      href: "https://planning-poker.kk-web.link",
      name: "Planning Poker",
      text: "プランニングポーカーができるサービスです。",
    },
    {
      href: "https://recban.kk-web.link",
      name: "りくばん！",
      text: "バンドメンバーを募集したり見つけたりすることができるサービスです。",
    },
    {
      href: "https://omocoro-archive.kk-web.link",
      name: "オモコロアーカイブ",
      text: "メディアサイト「オモコロ」の記事をまとめたサービスです。",
    },
    {
      href: "https://omocoro-daily.kk-web.link",
      name: "オモコロ&デイリーポータルＺ非公式リーダー",
      text: "メディアサイト「オモコロ」と「デイリーポータルＺ」の記事をまとめたサービスです。",
    },
    {
      href: "https://siritori-timer.kk-web.link",
      name: "限界しりとりタイマー",
      text: "ボードゲーム「限界しりとりパーティー！」のタイマーとして使えるサービスです。",
    },
    {
      href: "https://recigle.kk-web.link",
      name: "レシグル",
      text: "レシピを検索しやすくしてくれるサービスです。",
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
        <h2>WEB SERVICE</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
