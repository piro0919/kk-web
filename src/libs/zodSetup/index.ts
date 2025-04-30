import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import enTranslation from "zod-i18n-map/locales/en/zod.json";
import jaTranslation from "zod-i18n-map/locales/ja/zod.json";

export default async function zodSetup(locale: "en" | "ja"): Promise<void> {
  i18next.init({
    lng: locale,
    resources: {
      en: { zod: enTranslation },
      ja: { zod: jaTranslation },
    },
  });

  z.setErrorMap(zodI18nMap);
}
