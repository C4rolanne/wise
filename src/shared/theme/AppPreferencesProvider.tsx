import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { type AppColorScheme, appThemes } from "./appTheme";

export type AppLanguage = "pt-BR" | "en";

type AppPreferencesContextValue = {
  colorScheme: AppColorScheme;
  language: AppLanguage;
  colors: (typeof appThemes)[AppColorScheme];
  isReady: boolean;
  setColorScheme: (scheme: AppColorScheme) => void;
  setLanguage: (language: AppLanguage) => void;
  toggleColorScheme: () => void;
  toggleLanguage: () => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);
const colorSchemeStorageKey = "foodwise:color-scheme";
const languageStorageKey = "foodwise:language";

const isColorScheme = (value: string | null): value is AppColorScheme =>
  value === "light" || value === "dark";

const isLanguage = (value: string | null): value is AppLanguage =>
  value === "pt-BR" || value === "en";

const readWebStorage = (key: string) => {
  if (Platform.OS !== "web" || typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeWebStorage = (key: string, value: string) => {
  if (Platform.OS !== "web" || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preferences are optional UI state; ignore storage failures.
  }
};

interface AppPreferencesProviderProps {
  children: ReactNode;
  initialColorScheme?: AppColorScheme;
}

export function AppPreferencesProvider({
  children,
  initialColorScheme = "light",
}: AppPreferencesProviderProps) {
  const [colorScheme, setColorScheme] = useState<AppColorScheme>(() => {
    const storedColorScheme = readWebStorage(colorSchemeStorageKey);
    return isColorScheme(storedColorScheme) ? storedColorScheme : initialColorScheme;
  });
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const storedLanguage = readWebStorage(languageStorageKey);
    return isLanguage(storedLanguage) ? storedLanguage : "pt-BR";
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPreferences = async () => {
      try {
        if (Platform.OS === "web") {
          setIsReady(true);
          return;
        }

        const [storedColorScheme, storedLanguage] = await Promise.all([
          AsyncStorage.getItem(colorSchemeStorageKey),
          AsyncStorage.getItem(languageStorageKey),
        ]);

        if (!isMounted) return;
        if (isColorScheme(storedColorScheme)) {
          setColorScheme(storedColorScheme);
        }
        if (isLanguage(storedLanguage)) {
          setLanguage(storedLanguage);
        }
      } catch {
        // Preferences are optional UI state; keep defaults if storage is unavailable.
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;

    const backgroundColor = appThemes[colorScheme].background;
    document.documentElement.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
  }, [colorScheme]);

  const updateColorScheme = useCallback((scheme: AppColorScheme) => {
    setColorScheme(scheme);
    writeWebStorage(colorSchemeStorageKey, scheme);
    AsyncStorage.setItem(colorSchemeStorageKey, scheme).catch(() => undefined);
  }, []);

  const updateLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);
    writeWebStorage(languageStorageKey, nextLanguage);
    AsyncStorage.setItem(languageStorageKey, nextLanguage).catch(() => undefined);
  }, []);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      colorScheme,
      language,
      colors: appThemes[colorScheme],
      isReady,
      setColorScheme: updateColorScheme,
      setLanguage: updateLanguage,
      toggleColorScheme: () => updateColorScheme(colorScheme === "light" ? "dark" : "light"),
      toggleLanguage: () => updateLanguage(language === "pt-BR" ? "en" : "pt-BR"),
    }),
    [colorScheme, isReady, language, updateColorScheme, updateLanguage],
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
