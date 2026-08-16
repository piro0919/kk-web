/** つむぎの立ち絵の枚数。0 から数える。 */
const TSUMUGI_COUNT = 28;
/** めたんの立ち絵の枚数。 */
const METAN_COUNT = 14;

export type DailyCharacter = {
  isTsumugi: boolean;
  src: string;
};

/**
 * その日の立ち絵を決める。日付から決めるので、同じ日なら何度描いても同じ。
 * 呼ぶページは日をまたいで作り直されるよう revalidate を持つこと。持たないと
 * ビルドした日の絵のまま固まる。
 */
export default function getDailyCharacter(inverted = false): DailyCharacter {
  const date = new Date().getDate();
  const isTsumugi = date % 2 > 0 !== inverted;
  const index = date % (isTsumugi ? TSUMUGI_COUNT : METAN_COUNT);
  const suffix = index.toString().padStart(2, "0");

  return {
    isTsumugi,
    src: `/${isTsumugi ? "tsumugi" : "metan"}_${suffix}.png`,
  };
}
