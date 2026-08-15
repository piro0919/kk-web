import { getTranslations } from "next-intl/server";
import { FiGithub } from "react-icons/fi";
import styles from "./style.module.css";
import type { PortfolioCategory } from "@/libs/portfolio";

export type CardListProps = {
  category: PortfolioCategory;
  heading: string;
  locale: "en" | "ja";
};

export default async function CardList({
  category: { items, namespace },
  heading,
  locale,
}: CardListProps): Promise<React.JSX.Element> {
  const t = await getTranslations({
    locale,
    namespace: `Portfolio.${namespace ?? "WebService"}`,
  });
  const resolved = items.map(
    ({ archived = false, href, name, nameKey, repo, textKey }) => ({
      archived,
      // 畳んだものは公開ページが残っていないことがあるので、リポジトリへ繋ぐ。
      href: archived ? (repo ?? href) : href,
      name: nameKey ? t(nameKey) : (name ?? ""),
      // 畳んだものはカード自体がリポジトリ行きなので、アイコンは出さない。
      repo: archived ? undefined : repo,
      text: textKey ? t(textKey) : "",
    }),
  );
  const live = resolved.filter(({ archived }) => !archived);
  const archivedItems = resolved.filter(({ archived }) => archived);
  const renderItems = (list: typeof resolved): React.JSX.Element[] =>
    list.map(({ href, name, repo, text }) => (
      <li className={styles.item} key={href}>
        <div className={styles.itemInner}>
          <div className={styles.titleBlock}>
            <a
              className={styles.name}
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h2 className={styles.title}>{name}</h2>
            </a>
            {repo ? (
              <a
                aria-label={
                  locale === "ja"
                    ? `${name} の GitHub リポジトリ`
                    : `${name} on GitHub`
                }
                className={styles.repo}
                href={repo}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FiGithub size={18} />
              </a>
            ) : null}
          </div>
          {text ? <p className={styles.text}>{text}</p> : null}
        </div>
      </li>
    ));

  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <ul className={styles.list}>{renderItems(live)}</ul>
      {archivedItems.length > 0 ? (
        <>
          <h2 className={styles.subHeading}>ARCHIVED</h2>
          <ul className={styles.list}>{renderItems(archivedItems)}</ul>
        </>
      ) : null}
    </>
  );
}
