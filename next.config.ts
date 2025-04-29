// eslint-disable-next-line filenames/match-exported, filenames/match-regex
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
    // typedRoutes: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
