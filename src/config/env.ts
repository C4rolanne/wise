import { Platform } from "react-native";

const trimEnv = (value: string | undefined) => value?.trim() ?? "";

const removeTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const defaultApiUrl =
  Platform.OS === "android" ? "http://10.0.2.2:3001/api" : "http://localhost:3001/api";

const isProduction = process.env.NODE_ENV === "production";

const supabaseUrl = trimEnv(process.env.EXPO_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = trimEnv(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
const apiUrlFromEnv = trimEnv(process.env.EXPO_PUBLIC_API_URL);
const appUrlFromEnv = trimEnv(process.env.EXPO_PUBLIC_APP_URL);

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  apiBaseUrl: removeTrailingSlashes(apiUrlFromEnv || (isProduction ? "" : defaultApiUrl)),
  appBaseUrl: removeTrailingSlashes(appUrlFromEnv),
  isProduction,
  isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  isApiConfigured: Boolean(apiUrlFromEnv || !isProduction),
};

export const assertApiConfigured = () => {
  if (!env.apiBaseUrl) {
    throw new Error(
      "Configure EXPO_PUBLIC_API_URL. Em producao, a API nao pode apontar para localhost.",
    );
  }
};

export const assertSupabaseConfigured = () => {
  if (!env.isSupabaseConfigured) {
    throw new Error("Configure EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }
};
