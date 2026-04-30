import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { authService } from "@/services/auth.service";
import type { UserProfile } from "@/types/user";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Erro inesperado";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBackendUser = useCallback(async (currentSession: Session | null) => {
    if (!currentSession) {
      setUser(null);
      return;
    }

    const backendUser = await authService.me();
    setUser(backendUser);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentSession = await authService.getSession();
      setSession(currentSession);
      await loadBackendUser(currentSession);
    } catch (err) {
      setError(getErrorMessage(err));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadBackendUser]);

  useEffect(() => {
    refresh();

    const { data } = authService.onAuthStateChange((currentSession) => {
      setSession(currentSession);
      loadBackendUser(currentSession).catch((err) => setError(getErrorMessage(err)));
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [loadBackendUser, refresh]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const newSession = await authService.signInWithGoogle();
      setSession(newSession);
      await loadBackendUser(newSession);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadBackendUser]);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    session,
    user,
    loading,
    error,
    isAuthenticated: Boolean(session),
    accessToken: session?.access_token ?? null,
    signInWithGoogle,
    signOut,
    refresh,
  };
}
