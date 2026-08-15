import { getTranslations } from "next-intl/server";
import { FiExternalLink } from "react-icons/fi";
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
  const resolved = items.map(({ href, name, nameKey, repo, textKey }) => ({
    href,
    name: nameKey ? t(nameKey) : (name ?? ""),
    repo,
    text: textKey ? t(textKey) : "",
  }));

  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <ul className={styles.list}>
        {resolved.map(({ href, name, repo, text }) => (
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
                    aria-label={`${name} repository`}
                    className={styles.repo}
                    href={repo}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FiExternalLink size={16} />
                  </a>
                ) : null}
              </div>
              {text ? <p>{text}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
