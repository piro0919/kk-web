export default function getBaseUrl(): string {
  return process.env.VERCEL_ENV === "production"
    ? "https://kkweb.io"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
}
