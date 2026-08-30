import type { FormFeedbackState } from "@vc/ui";

/**
 * Normaliza a la forma única de `FormFeedback` los dos estados separados que
 * los hooks del panel mantienen internamente (`error: string | null` y
 * `success: boolean`).
 *
 * El mensaje de éxito lo aporta cada hook, no el componente: es texto de
 * dominio ("sincronizado con la web pública", "publicado en Facebook"), no de
 * presentación, y así el `.tsx` se queda sin decisiones que tomar.
 */
export function buildFormFeedback(
  error: string | null | undefined,
  success: boolean,
  successMessage: string
): FormFeedbackState | null {
  if (error) return { tone: "error", message: error };
  if (success) return { tone: "success", message: successMessage };
  return null;
}

/**
 * Variante para los hooks que solo exponen un `statusMessage` de éxito
 * (los paneles de listas: categorías, FAQs, testimonios, promociones).
 */
export function buildStatusFeedback(statusMessage: string | null | undefined): FormFeedbackState | null {
  return statusMessage ? { tone: "success", message: statusMessage } : null;
}
