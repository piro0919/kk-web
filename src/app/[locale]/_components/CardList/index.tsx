import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { SiNiconico, SiNpm, SiYoutube } from "react-icons/si";
import getOgpImage from "@/libs/getOgpImage";
import { type CategoryName, getPortfolio } from "@/libs/portfolio";
import styles from "./style.module.css";
import type { IconType } from "react-icons";

/** 置き場ごとの見た目。増える一覧なので URL から判る形にしておく。 */
function platformOf(url: string): { icon: IconType; label: string } {
  if (url.includes("nicovideo.jp"))
    return { icon: SiNiconico, label: "niconico" };

  if (url.includes("npmjs.com")) return { icon: SiNpm, label: "npm" };

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return { icon: SiYoutube, label: "YouTube" };
  }

  return { icon: FiExternalLink, label: "" };
}

export type CardListProps = {
  category: CategoryName;
  heading: string;
  locale: "en" | "ja";
};

export default async function CardList({
  category,
  heading,
  locale,
}: CardListProps): Promise<React.JSX.Element> {
  const t = await getTranslations({ locale, namespace: "Ui" });
  const items = getPortfolio(category, locale);
  const resolved = await Promise.all(
    items.map(async (item) => ({
      ...item,
      // 絵はサイト自身の og:image だけ。畳んだものは絵を出さない。
      thumbnail: item.archived ? null : await getOgpImage(item.href, locale),
    })),
  );
  const live = resolved.filter(({ archived }) => !archived);
  const archivedItems = resolved.filter(({ archived }) => archived);
  const renderItems = (
    list: typeof resolved,
    withThumbnail = true,
  ): React.JSX.Element[] =>
    list.map(({ altUrl, href, name, repo, text, thumbnail }) => {
      const alt = altUrl ? platformOf(altUrl) : null;
      const AltIcon = alt?.icon;

      return (
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
                <div className={styles.links}>
                  {altUrl && alt && AltIcon ? (
                    <a
                      aria-label={t("linkOnPlatform", {
                        name,
                        platform: alt.label,
                      })}
                      className={styles.repo}
                      href={altUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <AltIcon size={18} />
                    </a>
                  ) : null}
                  {repo ? (
                    <a
                      aria-label={t("linkOnRepository", { name })}
                      className={styles.repo}
                      href={repo}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FiGithub size={18} />
                    </a>
                  ) : null}
                </div>
              </div>
              {text ? <p className={styles.text}>{text}</p> : null}
            </div>
          </div>
        </li>
      );
    });

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
