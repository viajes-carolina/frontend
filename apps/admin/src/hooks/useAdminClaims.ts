import { useState, useCallback } from "react";
import { apiClient, ClaimRecordDTO } from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";

export function useAdminClaims(initialClaims: ClaimRecordDTO[] = []) {
  const [claims, setClaims] = useState<ClaimRecordDTO[]>(initialClaims);
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecordDTO | null>(null);
  const [updating, setUpdating] = useState(false);
  /**
   * El fallo de CARGA es el estado de la región, no el resultado de una acción:
   * lo pinta `RetryableError` y persiste hasta que un reintento lo resuelva. El
   * banner efímero de `FormFeedback` queda solo para el resultado de responder
   * un reclamo. Antes ambos compartían `error` y un fallo de red dejaba la
   * bandeja vacía con un mensaje que se borraba solo.
   */
  const [loadError, setLoadError] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);

  /**
   * Trae la bandeja ENTERA. El filtro por estado lo resuelve ahora el kit de
   * tabla en el cliente: pedirlo al servidor obligaba a recargar —y a vaciar la
   * tabla— cada vez que alguien cambiaba de pestaña, y dejaba al kit creyendo
   * que "no hay reclamos" cuando lo que no había era reclamos DE ESE estado.
   */
  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const data = await apiClient.getAdminClaims();
      setClaims(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id: number, newStatus: string, responseNotes?: string) => {
    try {
      setUpdating(true);
      setFeedback(null);
      const updated = await apiClient.updateClaimStatus(id, newStatus, responseNotes);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedClaim?.id === id) {
        setSelectedClaim(updated);
      }
      setFeedback({
        tone: "success",
        message: `El reclamo ${updated.claimCode} quedó registrado con su respuesta.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el reclamo. Su estado sigue como estaba.";
      setFeedback({ tone: "error", message: msg });
    } finally {
      setUpdating(false);
    }
  };

  return {
    claims,
    loading,
    loadError,
    selectedClaim,
    setSelectedClaim,
    updating,
    feedback,
    updateStatus,
    reload: fetchClaims,
  };
}
