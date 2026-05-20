import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { Session } from "@supabase/supabase-js";
import { Platform } from "react-native";

import { apiRequest } from "./api";
import { assertSupabaseConfigured, env } from "@/src/config/env";
import { supabase } from "./supabase";
import type { UserProfile } from "@/types/user";

WebBrowser.maybeCompleteAuthSession();

const authCallbackPath = "auth/callback";

const getUrlParams = (url: string) => {
  const [withoutHash, hash] = url.split("#");
  const query = withoutHash.split("?")[1];
  return new URLSearchParams(hash ?? query ?? "");
};

const getCurrentWebOrigin = () => {
  if (typeof window === "undefined") return "";
  return window.location.origin;
};

const getAuthRedirectUrl = () => {
  if (Platform.OS === "web") {
    const webOrigin = env.appBaseUrl || getCurrentWebOrigin();
    if (webOrigin) return `${webOrigin}/${authCallbackPath}`;
  }

  return Linking.createURL(authCallbackPath);
};

export const authService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getAccessToken() {
    const session = await this.getSession();
    return session?.access_token ?? null;
  },

  async signInWithGoogle(): Promise<Session | null> {
    assertSupabaseConfigured();

    const redirectTo = getAuthRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data.url) return null;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success") return null;

    const params = getUrlParams(result.url);
    const code = params.get("code");
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (code) {
      const { data: sessionData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
      return sessionData.session;
    }

    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
      return sessionData.session;
    }

    return null;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => callback(session));
  },

  me() {
    return apiRequest<UserProfile>("/auth/me");
  },
};
