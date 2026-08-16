import { z } from "zod";

/** 文字数の上限。画面側とサーバー側で同じ値を使う。 */
const LIMITS = { email: 254, message: 10000, name: 200, subject: 200 };

export type EmailSchemaMessages = {
  invalidEmail: string;
  required: string;
  tooLong: string;
};

/**
 * 問い合わせの検証。文言を差し替えられるようにしてあるのは、画面側で
 * 見る人の言葉に合わせるため。サーバー側は人が読まないので既定のまま。
 */
export function createEmailSchema({
  invalidEmail,
  required,
  tooLong,
}: EmailSchemaMessages): z.ZodObject<{
  email: z.ZodString;
  message: z.ZodString;
  name: z.ZodString;
  subject: z.ZodString;
}> {
  return z.object({
    email: z
      .string()
      .min(1, required)
      .email(invalidEmail)
      .max(LIMITS.email, tooLong),
    message: z.string().min(1, required).max(LIMITS.message, tooLong),
    name: z.string().min(1, required).max(LIMITS.name, tooLong),
    subject: z.string().min(1, required).max(LIMITS.subject, tooLong),
  });
}

export const emailSchema = createEmailSchema({
  invalidEmail: "invalid email",
  required: "required",
  tooLong: "too long",
});

export type PostEmailRequestFormData = z.infer<typeof emailSchema>;
