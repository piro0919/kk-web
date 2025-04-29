import env from "@/env";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export type PostEmailRequestFormData = {
  email: string;
  message: string;
  name: string;
  subject: string;
};

export type PostEmailResponseBody = {
  result: boolean;
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<PostEmailResponseBody>> {
  const token = request.cookies.get("token");

  if (!env.RECAPTCHA_SECRET_KEY || !token) {
    return NextResponse.json({ result: false }, { status: 500 });
  }

  const { value } = token;
  const {
    data: { success },
  } = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${value}`,
  );

  if (!success) {
    return NextResponse.json({ result: false }, { status: 500 });
  }

  const data = await request.formData();
  const email = data.get("email") as PostEmailRequestFormData["email"];
  const message = data.get("message") as PostEmailRequestFormData["message"];
  const name = data.get("name") as PostEmailRequestFormData["name"];
  const subject = data.get("subject") as PostEmailRequestFormData["subject"];

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
