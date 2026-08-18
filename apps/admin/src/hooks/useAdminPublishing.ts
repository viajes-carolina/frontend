"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient, type PublishRequestDTO, type PublishResponseDTO } from "@vc/api-client";

export function useAdminPublishing() {
  const [status, setStatus] = useState<PublishResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.getPublishingStatus();
      setStatus(res);
    } catch (err: any) {
      setError(err?.message || "Error al cargar estado de publicación");
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerPublish = useCallback(async (req: PublishRequestDTO) => {
    try {
      const res = await apiClient.triggerPublish(req);
      setStatus(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Error al publicar contenidos");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refreshStatus: fetchStatus,
    triggerPublish,
  };
}
