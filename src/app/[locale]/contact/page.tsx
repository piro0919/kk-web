import { type Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import getMetadata from "@/libs/getMetadata";
import ContactForm from "./_components/ContactForm";
import styles from "./style.module.css";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getMetadata({
    locale: toLocale(locale),
    path: "/contact",
    subTitle: "CONTACT",
  });
}

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
            <h1 className={styles.heading}>CONTACT</h1>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
