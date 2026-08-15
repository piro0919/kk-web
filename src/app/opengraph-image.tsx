/* eslint-disable filenames/match-exported, filenames/match-regex */
import { promises as fs } from "fs";
import { ImageResponse } from "next/og";
import path from "path";

async function loadGoogleFont(
  font: string,
  text: string,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);

    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

/** public 配下の画像を data URI にする。実行環境の URL に依存させないため。 */
async function loadImage(filename: string): Promise<string> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const buffer = await fs.readFile(
    path.join(process.cwd(), "public", filename),
  );

  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export const alt = "kk-web";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  const text = "kk-web";
  const [bubble, metan, tsumugi] = await Promise.all([
    loadImage("bubble.png"),
    loadImage("metan_05.png"),
    loadImage("tsumugi_24.png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#fff",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px dashed #000",
            borderRadius: 12,
            bottom: 24,
            left: 24,
            position: "absolute",
            right: 24,
            top: 24,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: 90,
            width: "100%",
          }}
        >
          <img alt="" height={273 / 1.5} src={bubble} width={512 / 1.5} />
        </div>
        <div
          style={{ bottom: 0, display: "flex", left: 90, position: "absolute" }}
        >
          <img
            alt="四国めたん"
            height={1772 / 4.5}
            src={metan}
            width={1990 / 4.5}
          />
        </div>
        <div
          style={{
            bottom: 0,
            display: "flex",
            position: "absolute",
            right: 90,
          }}
        >
          <img
            alt="春日部つむぎ"
            height={953 / 2.5}
            src={tsumugi}
            width={1080 / 2.5}
          />
        </div>
        <div
          style={{
            color: "#000",
            display: "flex",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: 700,
            justifyContent: "center",
            position: "absolute",
            top: 144,
            width: "100%",
          }}
        >
          {text}
        </div>
      </div>
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
