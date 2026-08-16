import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/stats`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  //
  // `/stats` は vercel.json で計測サービスへ横流ししている道筋。ここで拾うと
  // 言語の付いたページとして扱われて 404 になり、計測が1件も届かなくなる。
  // ドットを含む `/stats/script.js` だけ除外に引っ掛かって助かっていた。
  matcher: "/((?!api|stats|_next|_vercel|.*/opengraph-image|.*\\..*).*)",
};
