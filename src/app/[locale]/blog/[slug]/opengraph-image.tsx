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
        {/* 題名は立ち絵の上。長さで文字の大きさを変え、はみ出さないようにする。 */}
        <div
          style={{
            alignItems: "center",
            color: "#fff",
            display: "flex",
            fontSize: text.length > 28 ? 44 : 56,
            fontWeight: 700,
            justifyContent: "center",
            left: 120,
            lineHeight: 1.4,
            position: "absolute",
            textAlign: "center",
            top: 130,
            width: 960,
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
          data: await loadGoogleFont("Noto+Sans+JP:wght@700", text),
          name: "Noto_Sans_JP",
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
