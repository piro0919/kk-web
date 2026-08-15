import getOgpImage from "@/libs/getOgpImage";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
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
  const resolved = await Promise.all(
    items.map(
      async ({ archived = false, href, name, nameKey, repo, textKey }) => {
        // 畳んだものは公開ページが無いので、リンク先はリポジトリにする。
        const target = archived ? (repo ?? href) : href;
        // 絵はサイト自身の og:image だけ。畳んだものは絵を出さない。
        const thumbnail = archived ? null : await getOgpImage(target);

        return {
          archived,
          href: target,
          name: nameKey ? t(nameKey) : (name ?? ""),
          repo,
          text: textKey ? t(textKey) : "",
          thumbnail,
        };
      },
    ),
  );
  const live = resolved.filter(({ archived }) => !archived);
  const archivedItems = resolved.filter(({ archived }) => archived);
  const renderItems = (
    list: typeof resolved,
    withThumbnail = true,
  ): React.JSX.Element[] =>
    list.map(({ href, name, repo, text, thumbnail }) => (
      <li className={styles.item} key={href}>
        <div
          className={`${styles.itemInner} ${withThumbnail ? "" : styles.withoutThumbnail}`}
        >
          {!withThumbnail ? null : thumbnail === null ? (
            <div className={styles.noImage}>NO IMAGE</div>
          ) : (
            <div className={styles.thumbnail}>
              <Image
                alt=""
                fill={true}
                sizes="(width < 768px) 120px, 176px"
                src={thumbnail}
              />
            </div>
          )}
          <div className={styles.texts}>
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
          <ul className={styles.list}>{renderItems(archivedItems, false)}</ul>
        </>
      ) : null}
    </>
  );
}
