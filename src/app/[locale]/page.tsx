import { setRequestLocale } from "next-intl/server";
import getDailyCharacter from "@/libs/getDailyCharacter";
import BubbleHero from "./_components/BubbleHero";

// 立ち絵を日替わりにするため、1 時間ごとに作り直す。これが無いと
// ビルドした日の絵のまま固まる。
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  setRequestLocale(locale);

  const { isTsumugi, src } = getDailyCharacter();

  return (
    <main>
      <BubbleHero
        heading="kk-web"
        isTsumugi={isTsumugi}
        priority={true}
        src={src}
        text="kk-web"
      />
    </main>
  );
}
