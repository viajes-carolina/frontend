import { useState, useCallback, useEffect } from "react";
import { apiClient, ClaimRecordDTO } from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";

export function useAdminClaims(initialClaims: ClaimRecordDTO[] = []) {
  const [claims, setClaims] = useState<ClaimRecordDTO[]>(initialClaims);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecordDTO | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchClaims = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminClaims(status);
      setClaims(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar las hojas de reclamación";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    fetchClaims(newStatus);
  };

  const updateStatus = async (id: number, newStatus: string, responseNotes?: string) => {
    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);
      const updated = await apiClient.updateClaimStatus(id, newStatus, responseNotes);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedClaim?.id === id) {
        setSelectedClaim(updated);
      }
      setSuccessMessage(`Reclamo ${updated.claimCode} actualizado a ${newStatus}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar estado del reclamo";
      setError(msg);
    } finally {
      setUpdating(false);
    }
  };

  // Un único valor para `FormFeedback`. Se deriva en vez de reemplazar los dos
  // estados porque `fetchClaims` limpia solo el error y deja vivo el mensaje de
  // éxito anterior: unificarlos en un state cambiaría ese comportamiento.
  const feedback: FormFeedbackState | null = error
    ? { tone: "error", message: error }
    : successMessage
      ? { tone: "success", message: successMessage }
      : null;

  return {
    claims,
    statusFilter,
    loading,
    selectedClaim,
    setSelectedClaim,
    updating,
    error,
    successMessage,
    feedback,
    handleFilterChange,
    updateStatus,
    refetch: () => fetchClaims(statusFilter),
  };
}
