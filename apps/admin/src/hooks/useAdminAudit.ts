import { useState, useEffect, useCallback } from "react";
import { apiClient, AuditLogDTO } from "@vc/api-client";

export function useAdminAudit() {
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string>("ALL");

  const fetchLogs = useCallback(async (entityType?: string) => {
    try {
      setLoading(true);
      setError(null);
      const target = entityType !== undefined ? entityType : selectedEntityType;
      const data = await apiClient.getAuditLogs(target, 50);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar registros de auditoría.");
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
    error,
    selectedEntityType,
    setCategory,
    refreshLogs: () => fetchLogs(selectedEntityType),
  };
}
