import { type Locale, routing } from "@/i18n/routing";
import getArticles from "../getArticles";
import totalPages from "../totalPages";

/**
 * 記事一覧の N ページ目が存在する言語を返す。
 * 記事の数は言語で大きく違い、日本語の 10 ページ目に当たる英語のページは無い。
 * 無い言語版を hreflang で指すと 404 を指すことになるので、ある言語だけに絞る。
 */
export default async function getPagerLocales(page: number): Promise<Locale[]> {
  const counts = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      total: totalPages((await getArticles(locale)).length),
    })),
  );

  return counts
    .filter(({ total }) => page <= total)
    .map(({ locale }) => locale);
}
