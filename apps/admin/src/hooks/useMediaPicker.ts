"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient, MediaAssetDTO } from "@vc/api-client";

// Encapsula las llamadas a apiClient que antes vivían dentro de MediaPickerModal
// (packages/ui debe quedar libre de llamadas directas a la API — ver Fase 2 del
// plan de reestructuración). Un fallo real de red/servidor se propaga tal cual;
// ya no se fabrica un asset simulado con id falso.
export function useMediaPicker(isOpen: boolean) {
  const [items, setItems] = useState<MediaAssetDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    apiClient
      .getMediaList(0, 50)
      .then((res) => {
        if (!cancelled) setItems(res.items || []);
      })
      .catch((err) => {
        console.error("Error al cargar la biblioteca de medios:", err);
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const uploadFile = useCallback(async (file: File): Promise<MediaAssetDTO> => {
    const uploaded = await apiClient.uploadMedia(file);
    setItems((prev) => [uploaded, ...prev]);
    return uploaded;
  }, []);

  const saveFocalPoint = useCallback(
    async (id: number, payload: { focalX: number; focalY: number }): Promise<void> => {
      await apiClient.updateMediaFocalPoint(id, payload);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
      );
    },
    []
  );

  return { items, loading, uploadFile, saveFocalPoint };
}
