import { defineRouting } from "next-intl/routing";

// eslint-disable-next-line import/prefer-default-export
export const routing = defineRouting({
  defaultLocale: "en",
  localePrefix: "as-needed",
  locales: ["en", "ja"],
});
