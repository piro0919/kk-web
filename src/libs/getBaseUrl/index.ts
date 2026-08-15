export default function getBaseUrl(): string {
  if (process.env.VERCEL_ENV === "production") {
    return "https://kkweb.io";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
