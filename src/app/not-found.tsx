// eslint-disable-next-line filenames/match-regex
import BubbleHero from "./_components/BubbleHero";

export default function NotFound(): React.JSX.Element {
  // トップと逆のキャラを出す。
  const isTsumugi = !(new Date().getDate() % 2 > 0);

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
