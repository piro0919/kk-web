/* eslint-disable @next/next/no-img-element */

import getBaseUrl from "@/libs/getBaseUrl";
import { promises as fs } from "fs";
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path, { join } from "node:path";
import parseMD from "parse-md";

type GetArticleParams = {
  locale: string;
  slug: string;
};

type GetArticleData = {
  title: string;
};

async function getArticle({
  locale,
  slug,
}: GetArticleParams): Promise<GetArticleData> {
  const markdownPath = path.join(
    process.cwd(),
    "src",
    "markdown-pages",
    locale,
    `${slug}.md`,
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileContents = await fs.readFile(markdownPath, "utf8");
  const { metadata } = parseMD(fileContents);
  const { title } = metadata as {
    title: string;
  };

  return { title };
}

export const alt = "kk-web";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

type Context = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function GET(
  _: NextRequest,
  { params }: Context,
): Promise<ImageResponse> {
  const baseUrl = getBaseUrl();
  const { locale, slug } = await params;
  const { title: text } = await getArticle({ locale, slug });
  const jkg = await readFile(join(process.cwd(), "src/app/[locale]/jkg.ttf"));

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
            alignItems: "center",
            color: "#fff",
            display: "flex",
            fontSize: "42px",
            fontWeight: "700",
            height: "44%",
            justifyContent: "center",
            left: "10%",
            lineHeight: 1.25,
            padding: "0 36px",
            textAlign: "center",
            width: "80%",
          }}
        >
          {text.split("\n").map((line, i) => (
            <div key={i} style={{ whiteSpace: "pre-wrap" }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          data: jkg,
          name: "jkg",
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
