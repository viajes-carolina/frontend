import { useState, useEffect, useCallback } from "react";
import { apiClient, AdminUserDTO, LoginRequest, LoginResponse } from "@vc/api-client";

export function useAdminAuth() {
  const [currentUser, setCurrentUser] = useState<AdminUserDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const user = await apiClient.getCurrentAdminUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (req: LoginRequest): Promise<LoginResponse> => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await apiClient.loginAdmin(req);
      setCurrentUser(res.user);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Credenciales inválidas.";
      setError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Un fallo al cerrar sesión se propaga a propósito: si el servidor no
  // confirmó el cierre, la cookie sigue viva y dar por buena la salida
  // llevaría al usuario a /login creyendo que salió cuando no lo hizo.
  const logout = async () => {
    await apiClient.logoutAdmin();
    setCurrentUser(null);
  };

  return {
    currentUser,
    loading,
    submitting,
    error,
    login,
    logout,
    refreshSession: fetchSession,
    clearError: () => setError(null),
  };
}
