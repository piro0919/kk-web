import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  client: {
    NEXT_PUBLIC_HOTJAR_ID: z.string().min(1),
    NEXT_PUBLIC_HOTJAR_SV: z.string().min(1),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID,
    NEXT_PUBLIC_HOTJAR_SV: process.env.NEXT_PUBLIC_HOTJAR_SV,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NODEMAILER_AUTH_PASS: process.env.NODEMAILER_AUTH_PASS,
    NODEMAILER_AUTH_USER: process.env.NODEMAILER_AUTH_USER,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    UMAMI_API_KEY: process.env.UMAMI_API_KEY,
    UMAMI_API_URL: process.env.UMAMI_API_URL,
    UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
  },
  server: {
    NODEMAILER_AUTH_PASS: z.string().min(1),
    NODEMAILER_AUTH_USER: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    UMAMI_API_KEY: z.string().min(1),
    UMAMI_API_URL: z.string().url().default("https://api.umami.is/v1"),
    UMAMI_WEBSITE_ID: z.string().min(1),
  },
});

export default env;
