"use client";
import { format } from "date-fns";
import { useMemo } from "react";
import styles from "./style.module.css";

type Article = {
  date: string;
  slug: string;
  text: string;
  title: string;
};

export type NoteProps = {
  articles: Article[];
};

export default function Note({ articles }: NoteProps): React.JSX.Element {
  const items = useMemo(
    () =>
      articles.map(({ date, slug, text, title }) => (
        <a
          className={styles.link}
          href={slug}
          key={slug}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className={styles.vStack}>
            <h2 className={styles.heading}>{title}</h2>
            <div className={styles.textWrapper}>
              <div className={styles.text}>{text}</div>
            </div>
            <div className={styles.date}>{format(date, "yyyy-MM-dd")}</div>
          </div>
        </a>
      )),
    [articles],
  );

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h1>NOTE</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>{items}</div>
      </div>
    </>
  );
}
