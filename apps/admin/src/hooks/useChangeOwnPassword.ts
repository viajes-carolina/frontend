"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { apiClient, ApiError } from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";

const MIN_PASSWORD_LENGTH = 6;

/**
 * Cambio de la propia contraseña: campos, validación local y llamada al API.
 *
 * La validación (largo mínimo y confirmación) vivía en `PerfilClientView.tsx`
 * junto a un `localError` paralelo al `error` del hook, así que la pantalla
 * tenía que combinar dos fuentes de error. Aquí queda una sola.
 */
export function useChangeOwnPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFeedback({
        tone: "error",
        message: `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ tone: "error", message: "Las contraseñas no coinciden." });
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.changeOwnPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({ tone: "success", message: "Contraseña actualizada exitosamente." });
    } catch (err) {
      let message = "No se pudo actualizar la contraseña.";
      if (err instanceof ApiError && err.body && typeof err.body === "object" && "message" in err.body) {
        message = String((err.body as { message: unknown }).message);
      } else if (err instanceof Error) {
        message = err.message;
      }
      setFeedback({ tone: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    submitting,
    feedback,
    handleSubmit,
  };
}
