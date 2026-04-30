import { useCallback, useEffect, useState } from "react";

import { usersService } from "@/services/users.service";
import type { UpdateUserProfileInput, UserProfile } from "@/types/user";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Erro inesperado";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setUser(await usersService.me());
    } catch (err) {
      setError(getErrorMessage(err));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (input: UpdateUserProfileInput) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await usersService.updateMe(input);
      setUser(updatedUser);
      setSuccess("Perfil atualizado");
      return updatedUser;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { user, loading, saving, error, success, refresh, update };
}
