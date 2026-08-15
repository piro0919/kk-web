import { Link } from "@/i18n/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
        <Link className={styles.back} href="/blog">
          ← BLOG
        </Link>
      </div>
    </article>
  );
}
