/* eslint-disable filenames/match-exported, filenames/match-regex */
import getArticles from "@/libs/getArticles";
import { loadGoogleFont, loadImage, OGP_SIZE, OgpFrame } from "@/libs/ogpImage";
import { ImageResponse } from "next/og";

export const alt = "kk-web";

export const size = OGP_SIZE;

export const contentType = "image/png";

type ImageProps = {
  params: { locale: string; slug: string };
};

/**
 * 題名の長さから字の大きさを決める。日本語は1文字が字の大きさとほぼ同じ幅を
 * 取るので、幅 1000px に何文字入るかで行数が決まる。3行までに収める。
 */
function titleSize(text: string): number {
  if (text.length <= 16) return 60;

  if (text.length <= 30) return 48;

  if (text.length <= 48) return 40;

  return 34;
}

export default async function Image({
  params,
}: ImageProps): Promise<ImageResponse> {
  const { locale, slug } = params;
  const articles = await getArticles(locale as "en" | "ja");
  const text = articles.find((item) => item.slug === slug)?.title ?? "kk-web";
  const [background, metan, tsumugi] = await Promise.all([
    loadImage("ogp-background.png"),
    loadImage("metan_05.png"),
    loadImage("tsumugi_24.png"),
  ]);

  return new ImageResponse(
    (
      <OgpFrame background={background} metan={metan} tsumugi={tsumugi}>
        {/* 題名は立ち絵より上に収める。長いほど字を小さくして、
            いちばん長い題名でも3行に収まり、立ち絵に掛からないようにする。 */}
        <div
          style={{
            alignItems: "center",
            color: "#fff",
            display: "flex",
            fontSize: titleSize(text),
            fontWeight: 700,
            justifyContent: "center",
            left: 100,
            lineHeight: 1.35,
            position: "absolute",
            textAlign: "center",
            top: 104,
            width: 1000,
          }}
        >
          {text}
        </div>
      </OgpFrame>
    ),
    {
      ...size,
      fonts: [
        {
          data: await loadGoogleFont("Zen+Kaku+Gothic+New:wght@700", text),
          name: "Zen_Kaku_Gothic_New",
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
