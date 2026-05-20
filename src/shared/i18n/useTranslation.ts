import { useCallback } from "react";

import { useAppPreferences } from "@/src/shared/theme";

import { translations, type TranslationKey } from "./translations";

type TranslationParams = Record<string, string | number>;

export function useTranslation() {
  const { language } = useAppPreferences();

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams): string => {
      const template = String(translations[language][key] ?? translations.en[key] ?? key);

      if (!params) return template;

      return Object.entries(params).reduce(
        (message, [paramKey, value]) => message.replace(`{${paramKey}}`, String(value)),
        template,
      );
    },
    [language],
  );

  return { t, language };
}
