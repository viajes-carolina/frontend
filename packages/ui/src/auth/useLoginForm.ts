"use client";

import { useState } from "react";
import type { LoginRequest } from "@vc/api-client";

export interface UseLoginFormOptions {
  onSubmit: (req: LoginRequest) => Promise<void>;
  /** Se invoca al primer tecleo tras un error para limpiar el banner. */
  onClearError?: () => void;
  errorMessage?: string | null;
  loading?: boolean;
}

export interface UseLoginFormResult {
  usernameOrEmail: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  /** El submit se bloquea sin credenciales o mientras la petición está en vuelo. */
  canSubmit: boolean;
  setUsernameOrEmail: (value: string) => void;
  setPassword: (value: string) => void;
  toggleShowPassword: () => void;
  setRememberMe: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Estado del formulario de acceso al panel. Vive aquí (y no en el `.tsx`) para
 * que `LoginCard` quede como plantilla pura: la autenticación real la resuelve
 * `useAdminAuth` en `apps/admin` y llega a este hook como `onSubmit`.
 */
export function useLoginForm({
  onSubmit,
  onClearError,
  errorMessage = null,
  loading = false,
}: UseLoginFormOptions): UseLoginFormResult {
  const [usernameOrEmail, setUsernameOrEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Un error de credenciales deja de ser cierto en cuanto el usuario corrige el
  // campo, así que el banner se retira al primer cambio en vez de quedarse
  // contradiciendo lo que hay escrito.
  const clearErrorOnEdit = () => {
    if (errorMessage && onClearError) onClearError();
  };

  const setUsernameOrEmail = (value: string) => {
    setUsernameOrEmailState(value);
    clearErrorOnEdit();
  };

  const setPassword = (value: string) => {
    setPasswordState(value);
    clearErrorOnEdit();
  };

  const canSubmit = !loading && usernameOrEmail.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      usernameOrEmail: usernameOrEmail.trim(),
      password,
      rememberMe,
    });
  };

  return {
    usernameOrEmail,
    password,
    showPassword,
    rememberMe,
    canSubmit,
    setUsernameOrEmail,
    setPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    setRememberMe,
    handleSubmit,
  };
}
