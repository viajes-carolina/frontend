import { useState, useEffect, useCallback } from "react";
import { apiClient, AuditLogDTO } from "@vc/api-client";

export function useAdminAudit() {
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  /* Mismo caso que en `useAdminUsers`: el error se guardaba y no se pintaba,
     así que un fallo de red se leía como "no hay registros de auditoría" — lo
     peor que puede decir una bitácora. Lo cuenta `RetryableError`. */
  const [loadError, setLoadError] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<string>("ALL");

  const fetchLogs = useCallback(async (entityType?: string) => {
    try {
      setLoading(true);
      setLoadError(false);
      const target = entityType !== undefined ? entityType : selectedEntityType;
      const data = await apiClient.getAuditLogs(target, 50);
      setLogs(data);
    } catch (err) {
      console.error("Error loading audit logs:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedEntityType]);

  useEffect(() => {
    fetchLogs(selectedEntityType);
  }, [selectedEntityType, fetchLogs]);

  const setCategory = (category: string) => {
    setSelectedEntityType(category);
  };

  return {
    logs,
    loading,
    loadError,
    selectedEntityType,
    setCategory,
    refreshLogs: () => fetchLogs(selectedEntityType),
  };
}
