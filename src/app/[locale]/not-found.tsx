// eslint-disable-next-line filenames/match-regex
import getDailyCharacter from "@/libs/getDailyCharacter";
import BubbleHero from "./_components/BubbleHero";

export default function NotFound(): React.JSX.Element {
  // トップと逆のキャラを出す。
  const { isTsumugi } = getDailyCharacter(true);

  return (
    <main>
      <BubbleHero
        heading="404"
        isTsumugi={isTsumugi}
        src={isTsumugi ? "/tsumugi_26.png" : "/metan_04.png"}
        text="not found..."
      />
    </main>
  );
}
