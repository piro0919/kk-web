import { promises as fs } from "fs";
import { getLocale } from "next-intl/server";
import { type NextRequest, NextResponse } from "next/server";
import parseMD from "parse-md";
import path from "path";

export type GetArticleResponseBody = {
  content: string;
  date: string;
  title: string;
};

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _: NextRequest,
  { params }: Context,
): Promise<NextResponse<GetArticleResponseBody>> {
  const { slug } = await params;
  const locale = await getLocale();
  const markdownPath = path.join(
    process.cwd(),
    "/src/markdown-pages",
    locale,
    `${slug}.md`,
  );
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileContents = await fs.readFile(markdownPath, "utf8");
  const { content, metadata } = parseMD(fileContents);
  const { date, title } = metadata as {
    date: string;
    slug: string;
    title: string;
  };

  return NextResponse.json({ content, date, title }, { status: 200 });
}
