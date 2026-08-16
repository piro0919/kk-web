import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * どのページにも当たらなかった URL を受ける。ここを置かないと、Next が
 * ロケールのレイアウトの外で打ち切ってしまい、額縁もナビも無い既定の
 * 404 画面が出る。決まった名前の区画のほうが先に選ばれるので、
 * 既にあるページを横取りすることはない。
 */
export default async function Page({ params }: PageProps): Promise<never> {
  const { locale } = await params;

  setRequestLocale(locale);

  notFound();
}
