import axios from "axios";
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
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });

    return false;
  }

  entry.count += 1;

  return entry.count > RATE_LIMIT_MAX;
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

  const { value } = token;
  const {
    data: { success },
  } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${value}`,
  );

  // 人の証明に通らなかった。断りなので 403。
  if (!success) {
    return NextResponse.json({ result: false }, { status: 403 });
  }

  const data = await request.formData();
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
      replyTo: `${name} <${email}>`,
      subject: `【kk-web】${subject}`,
      text: message,
      to: env.NODEMAILER_AUTH_USER,
    });

    return NextResponse.json({ result: true }, { status: 200 });
  } catch {
    return NextResponse.json({ result: false }, { status: 500 });
  }
}
