import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import styles from "./style.module.css";
import type { Article as ArticleType } from "@/libs/getArticles";

export type ArticleProps = {
  article: ArticleType;
};

export default function Article({ article }: ArticleProps): React.JSX.Element {
  const { content, date, title } = article;

  return (
    <article className={styles.article}>
      <div className={styles.inner}>
        <Link className={styles.back} href="/blog">
          ← BLOG
        </Link>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>{date}</p>
        <hr className={styles.hr} />
        <div className={`markdown-body ${styles.body}`}>
          {/* 昔の記事は本文に生の HTML を書いている。素通しにしないと
              タグが文字のまま出るので通す。中身は自分で書いた md だけ。 */}
          <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
            {content}
          </Markdown>
        </div>
        <Link className={styles.back} href="/blog">
          ← BLOG
        </Link>
      </div>
    </article>
  );
}
