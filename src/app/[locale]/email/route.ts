import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import env from "@/env";
import { emailSchema } from "./schema";

export type { PostEmailRequestFormData } from "./schema";

export type PostEmailResponseBody = {
  result: boolean;
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
/**
 * 直近の送信数。関数のインスタンスごとに持つので、これだけで守れているとは
 * 見なさない。人の証明が前段にあり、ここは同じ場所からの連投を鈍らせるだけ。
 * 放っておくと古い記録が溜まるので、窓を跨いだものはそのつど捨てる。
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  for (const [key, { resetTime }] of rateLimitMap) {
    if (now > resetTime) rateLimitMap.delete(key);
  }

  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });

    return false;
  }

  entry.count += 1;

  return entry.count > RATE_LIMIT_MAX;
}

/** reCAPTCHA へ問い合わせる。落ちていたら通さない。 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    // 鍵とトークンはクエリではなく本文で送る。値がそのまま URL に載らず、
    // 記号が混じっても壊れない。
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        body: new URLSearchParams({
          response: token,
          secret: env.RECAPTCHA_SECRET_KEY,
        }),
        method: "POST",
      },
    );

    if (!response.ok) {
      // eslint-disable-next-line no-console -- 問い合わせが届かない原因を、関数のログで追えるようにする。
      console.error(`reCAPTCHA responded with ${response.status}`);

      return false;
    }

    const { "error-codes": errorCodes = [], success } =
      (await response.json()) as {
        "error-codes"?: string[];
        success?: boolean;
      };

    // 鍵の失効や設定違いでは全員が断られる。人の失敗と見分けて残す。
    if (errorCodes.some((code) => code.endsWith("-input-secret"))) {
      // eslint-disable-next-line no-console -- 問い合わせが届かない原因を、関数のログで追えるようにする。
      console.error("reCAPTCHA rejected the secret key", errorCodes);
    }

    return success === true;
  } catch (error) {
    // eslint-disable-next-line no-console -- 問い合わせが届かない原因を、関数のログで追えるようにする。
    console.error("reCAPTCHA verification failed", error);

    return false;
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<PostEmailResponseBody>> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ result: false }, { status: 429 });
  }

  const token = request.cookies.get("token");

  // 人の証明が付いていない。送る側の問題なので 400 番台で返す。
  if (!token) {
    return NextResponse.json({ result: false }, { status: 400 });
  }

  // 人の証明に通らなかった。断りなので 403。
  if (!(await verifyToken(token.value))) {
    return NextResponse.json({ result: false }, { status: 403 });
  }

  // 読めない本文も入力の誤りとして扱い、下の 400 に合流させる。
  const data = await request.formData().catch(() => new FormData());
  const parsed = emailSchema.safeParse({
    email: data.get("email"),
    message: data.get("message"),
    name: data.get("name"),
    subject: data.get("subject"),
  });

  if (!parsed.success) {
    return NextResponse.json({ result: false }, { status: 400 });
  }

  const { email, message, name, subject } = parsed.data;

  try {
    const transporter = nodemailer.createTransport({
      auth: {
        pass: env.NODEMAILER_AUTH_PASS,
        user: env.NODEMAILER_AUTH_USER,
      },
      port: 465,
      secure: true,
      service: "gmail",
    });

    await transporter.sendMail({
      // 文字列で組むと、名前の「:」や括弧が宛先の構文として解釈されて崩れる。
      replyTo: { address: email, name },
      subject: `【kk-web】${subject}`,
      text: message,
      to: env.NODEMAILER_AUTH_USER,
    });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch (error) {
    // 送り主の名前や本文は残さない。追いたいのは送れなかった理由だけ。
    // eslint-disable-next-line no-console -- 問い合わせが届かない原因を、関数のログで追えるようにする。
    console.error("Failed to send contact email", error);

    return NextResponse.json({ result: false }, { status: 500 });
  }
}
