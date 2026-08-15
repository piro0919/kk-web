import getMetadata from "@/libs/getMetadata";
import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import styles from "./style.module.css";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: locale as "en" | "ja",
    path: "/about",
    subTitle: "ABOUT",
  });
}

const ITEMS = [
  { label: "Name", text: "Kouhei Kawamura" },
  { label: "Handle", text: "piro" },
  { label: "Address", text: "Tokyo, Japan" },
  { label: "Job", text: "CTO / Scrum Master / Software Developer" },
];

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main>
      <div className={styles.wrapper}>
        <div className={styles.mat}>
          <div className={styles.panel}>
            <h1 className={styles.heading}>ABOUT</h1>
            <dl className={styles.list}>
              {ITEMS.map(({ label, text }) => (
                <div className={styles.item} key={label}>
                  <dt className={styles.label}>{label}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
