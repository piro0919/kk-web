/* eslint-disable filenames/match-exported, filenames/match-regex */
import { loadGoogleFont, loadImage, OGP_SIZE, OgpFrame } from "@/libs/ogpImage";
import { ImageResponse } from "next/og";

export const alt = "kk-web";

export const size = OGP_SIZE;

export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  const text = "kk-web";
  const [background, bubble, metan, tsumugi] = await Promise.all([
    loadImage("ogp-background.png"),
    loadImage("bubble.png"),
    loadImage("metan_05.png"),
    loadImage("tsumugi_24.png"),
  ]);

  return new ImageResponse(
    (
      <OgpFrame background={background} metan={metan} tsumugi={tsumugi}>
        {/* 吹き出しは立ち絵より前。中身の字は吹き出しの白地に載る。 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: 110,
            width: "100%",
          }}
        >
          <img alt="" height={273 / 1.2} src={bubble} width={512 / 1.2} />
        </div>
        <div
          style={{
            color: "#000",
            display: "flex",
            fontSize: 44,
            fontStyle: "italic",
            fontWeight: 700,
            justifyContent: "center",
            position: "absolute",
            top: 178,
            width: "100%",
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
          data: await loadGoogleFont("Noto+Sans:ital,wght@1,700", text),
          name: "Noto_Sans",
          style: "italic",
          weight: 700,
        },
      ],
    },
  );
}
