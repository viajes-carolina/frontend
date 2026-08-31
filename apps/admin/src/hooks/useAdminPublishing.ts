"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient, type PublishRequestDTO, type PublishResponseDTO } from "@vc/api-client";

export function useAdminPublishing() {
  const [status, setStatus] = useState<PublishResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  /* El error de CARGA del estado de publicación tampoco se pintaba: la tarjeta
     se quedaba en su esqueleto para siempre. Ahora lo cuenta `RetryableError`.
     El fallo de la PUBLICACIÓN es otra cosa y ya lo reporta el propio
     `PublishingManagerCard` en su banner, así que no se toca aquí. */
  const [loadError, setLoadError] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const res = await apiClient.getPublishingStatus();
      setStatus(res);
    } catch (err) {
      console.error("Error loading publishing status:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerPublish = useCallback(async (req: PublishRequestDTO) => {
    const res = await apiClient.triggerPublish(req);
    setStatus(res);
    return res;
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    loadError,
    refreshStatus: fetchStatus,
    triggerPublish,
  };
}
