import Markdown, { type ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import styles from "./style.module.css";
import type { Article as ArticleType } from "@/libs/getArticles";

export type ArticleProps = {
  article: ArticleType;
};

// 自サイトを指す URL は同じタブのままにしたい。プレビュー環境でも本番の
// ドメインで書かれたリンクは外部扱いしない。
const INTERNAL_HOSTS = ["kkweb.io", "www.kkweb.io"];

function isExternal(href: string | undefined): boolean {
  if (!href?.startsWith("http")) {
    return false;
  }

  try {
    return !INTERNAL_HOSTS.includes(new URL(href).hostname);
  } catch {
    return false;
  }
}

function Anchor({
  href,
  // react-markdown が渡してくる mdast のノード。DOM 属性ではないので捨てる。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  node: _node,
  ...props
}: ExtraProps & React.ComponentPropsWithoutRef<"a">): React.JSX.Element {
  // 昔の記事は生の HTML で target を書いている。書いてあるものは尊重する。
  const external = props.target === undefined && isExternal(href);

  return (
    <a
      href={href}
      {...props}
      rel={external ? "noopener noreferrer" : props.rel}
      target={external ? "_blank" : props.target}
    />
  );
}

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
          <Markdown
            components={{ a: Anchor }}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
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
