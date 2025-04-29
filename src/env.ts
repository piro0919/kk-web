import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  client: {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1),
    NEXT_PUBLIC_HOTJAR_ID: z.string().min(1),
    NEXT_PUBLIC_HOTJAR_SV: z.string().min(1),
    NEXT_PUBLIC_LOG_ROCKET_APP_ID: z.string().min(1),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
  },
  // eslint-disable-next-line write-good-comments/write-good-comments
  // you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID,
    NEXT_PUBLIC_HOTJAR_SV: process.env.NEXT_PUBLIC_HOTJAR_SV,
    NEXT_PUBLIC_LOG_ROCKET_APP_ID: process.env.NEXT_PUBLIC_LOG_ROCKET_APP_ID,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  server: {
    NODEMAILER_AUTH_PASS: z.string().min(1),
    NODEMAILER_AUTH_USER: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
  },
});

export default env;
