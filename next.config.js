const path = require("path");
const { withKumaUI } = require("@kuma-ui/next-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

module.exports = withBundleAnalyzer(withKumaUI(nextConfig));
