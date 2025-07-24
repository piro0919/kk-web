// eslint-disable-next-line filenames/match-exported, filenames/match-regex
import getBaseUrl from "@/libs/getBaseUrl";
import { ImageResponse } from "next/og";

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

    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export const alt = "kk-web";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  const baseUrl = getBaseUrl();
  const text = "kk-web";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#202124",
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            position: "absolute",
            top: 90,
            width: "100%",
          }}
        >
          <img
            alt=""
            height={273 / 1.5}
            src={`${baseUrl}/bubble.png`}
            width={512 / 1.5}
          />
        </div>
        <div
          style={{
            bottom: 0,
            display: "flex",
            left: 90,
            position: "absolute",
          }}
        >
          <img
            alt="四国めたん"
            height={1772 / 4.5}
            src={`${baseUrl}/metan_05.png`}
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
            height={1772 / 4.5}
            src={`${baseUrl}/tsumugi_24.png`}
            width={1990 / 4.5}
          />
        </div>
        <div
          style={{
            color: "#000",
            display: "flex",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: 700,
            height: "100%",
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
