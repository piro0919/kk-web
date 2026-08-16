import { promises as fs } from "node:fs";
import path from "node:path";

/** サイトのダークモードと同じ地の色。 */
export const OGP_BACKGROUND = "#202124";

export const OGP_SIZE = { height: 630, width: 1200 };

/**
 * 必要な字だけを含む書体を Google Fonts から取る。
 * text を渡すと、その字だけのサブセットが返る。
 */
export async function loadGoogleFont(
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
export async function loadImage(filename: string): Promise<string> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const buffer = await fs.readFile(
    path.join(process.cwd(), "public", filename),
  );

  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export type OgpFrameProps = {
  background: string;
  /** 立ち絵より前に置くもの。吹き出しや題名。 */
  children: React.ReactNode;
  metan: string;
  tsumugi: string;
};

/**
 * 背景タイル・破線の額縁・左右の立ち絵。共通と記事で同じ土台を使う。
 * ImageResponse は flex しか効かないので、位置は absolute で決める。
 */
export function OgpFrame({
  background,
  children,
  metan,
  tsumugi,
}: OgpFrameProps): React.JSX.Element {
  return (
    <div
      style={{
        background: OGP_BACKGROUND,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        height={OGP_SIZE.height}
        src={background}
        style={{ left: 0, position: "absolute", top: 0 }}
        width={OGP_SIZE.width}
      />
      <div
        style={{
          // Satori は rgb(... / 45%) の書き方を解釈しないので rgba で書く。
          border: "2px dashed rgba(255, 255, 255, 0.45)",
          borderRadius: 12,
          bottom: 24,
          left: 24,
          position: "absolute",
          right: 24,
          top: 24,
        }}
      />
      <div
        style={{ bottom: 0, display: "flex", left: 90, position: "absolute" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="四国めたん"
          height={1772 / 4.5}
          src={metan}
          width={1990 / 4.5}
        />
      </div>
      <div
        style={{ bottom: 0, display: "flex", position: "absolute", right: 90 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="春日部つむぎ"
          height={953 / 2.5}
          src={tsumugi}
          width={1080 / 2.5}
        />
      </div>
      {children}
    </div>
  );
}
