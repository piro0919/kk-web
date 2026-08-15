import { setRequestLocale } from "next-intl/server";
import BubbleHero from "./_components/BubbleHero";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  // 日替わりで2キャラを入れ替える。日付から決めるので描画のたびにぶれない。
  const date = new Date().getDate();
  const isTsumugi = date % 2 > 0;
  const index = date % (isTsumugi ? 28 : 14);
  const suffix = index.toString().padStart(2, "0");

  return (
    <main>
      <BubbleHero
        heading="kk-web"
        isTsumugi={isTsumugi}
        priority={true}
        src={`/${isTsumugi ? "tsumugi" : "metan"}_${suffix}.png`}
        text="kk-web"
      />
    </main>
  );
}
