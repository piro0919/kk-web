import { FiExternalLink } from "react-icons/fi";
import styles from "./style.module.css";
import type { PortfolioItem } from "@/libs/portfolio";

export type CardListProps = {
  heading: string;
  items: PortfolioItem[];
};

export default function CardList({
  heading,
  items,
}: CardListProps): React.JSX.Element {
  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <ul className={styles.list}>
        {items.map(({ href, name, repo, text }) => (
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
                    aria-label={`${name} のリポジトリ`}
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
