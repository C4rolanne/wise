import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { type AppColorScheme, appThemes } from "./appTheme";

export type AppLanguage = "pt-BR" | "en";

type AppPreferencesContextValue = {
  colorScheme: AppColorScheme;
  language: AppLanguage;
  colors: (typeof appThemes)[AppColorScheme];
  setColorScheme: (scheme: AppColorScheme) => void;
  setLanguage: (language: AppLanguage) => void;
  toggleColorScheme: () => void;
  toggleLanguage: () => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);
const colorSchemeStorageKey = "foodwise:color-scheme";
const languageStorageKey = "foodwise:language";

interface AppPreferencesProviderProps {
  children: ReactNode;
  initialColorScheme?: AppColorScheme;
}

export function AppPreferencesProvider({
  children,
  initialColorScheme = "light",
}: AppPreferencesProviderProps) {
  const [colorScheme, setColorScheme] = useState<AppColorScheme>(initialColorScheme);
  const [language, setLanguage] = useState<AppLanguage>("pt-BR");

  useEffect(() => {
    let isMounted = true;

    const loadPreferences = async () => {
      try {
        const [storedColorScheme, storedLanguage] = await Promise.all([
          AsyncStorage.getItem(colorSchemeStorageKey),
          AsyncStorage.getItem(languageStorageKey),
        ]);

        if (!isMounted) return;
        if (storedColorScheme === "light" || storedColorScheme === "dark") {
          setColorScheme(storedColorScheme);
        }
        if (storedLanguage === "pt-BR" || storedLanguage === "en") {
          setLanguage(storedLanguage);
        }
      } catch {
        // Preferences are optional UI state; keep defaults if storage is unavailable.
      }
    };

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateColorScheme = useCallback((scheme: AppColorScheme) => {
    setColorScheme(scheme);
    AsyncStorage.setItem(colorSchemeStorageKey, scheme).catch(() => undefined);
  }, []);

  const updateLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);
    AsyncStorage.setItem(languageStorageKey, nextLanguage).catch(() => undefined);
  }, []);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      colorScheme,
      language,
      colors: appThemes[colorScheme],
      setColorScheme: updateColorScheme,
      setLanguage: updateLanguage,
      toggleColorScheme: () => updateColorScheme(colorScheme === "light" ? "dark" : "light"),
      toggleLanguage: () => updateLanguage(language === "pt-BR" ? "en" : "pt-BR"),
    }),
    [colorScheme, language, updateColorScheme, updateLanguage],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used inside AppPreferencesProvider");
  }

  return context;
}
