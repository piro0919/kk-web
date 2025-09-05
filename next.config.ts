// eslint-disable-next-line filenames/match-regex
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["app.logrocket.com"],
  experimental: {
    typedEnv: true,
    useLightningcss: true,
    // typedRoutes: true,
  },
  images: {
    unoptimized: true,
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
