import { useState } from "react";
import { apiClient, ApiError } from "@vc/api-client";

export function useChangeOwnPassword() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);
      await apiClient.changeOwnPassword({ currentPassword, newPassword });
      setSuccess(true);
    } catch (err) {
      let msg = "No se pudo actualizar la contraseña.";
      if (err instanceof ApiError && err.body && typeof err.body === "object" && "message" in err.body) {
        msg = String((err.body as { message: unknown }).message);
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    success,
    changePassword,
    clearFeedback: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
