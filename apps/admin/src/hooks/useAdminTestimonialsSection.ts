import { useState, useCallback, useEffect } from "react";
import {
  apiClient,
  HomeTestimonialsSectionDTO,
  MediaAssetDTO,
  UpdateHomeTestimonialsSectionRequest,
} from "@vc/api-client";

export function useAdminTestimonialsSection(initialConfig?: HomeTestimonialsSectionDTO) {
  const [config, setConfig] = useState<HomeTestimonialsSectionDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminHomeTestimonialsSection();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la configuración de Experiencias";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialConfig) {
      fetchConfig();
    }
  }, [initialConfig, fetchConfig]);

  const updateField = useCallback(
    <K extends keyof HomeTestimonialsSectionDTO>(field: K, value: HomeTestimonialsSectionDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const handleSelectBlobMedia = useCallback(
    (media: MediaAssetDTO) => {
      updateField("blobMediaId", media.id);
      updateField("blobMediaUrl", media.storagePath);
      updateField("blobFocalX", media.focalX || 50);
      updateField("blobFocalY", media.focalY || 50);
    },
    [updateField]
  );

  const saveConfig = useCallback(
    async (payload?: UpdateHomeTestimonialsSectionRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        title: config.title,
        subtitle: config.subtitle,
        blobMediaId: config.blobMediaId,
        blobMediaUrl: config.blobMediaUrl,
        blobFocalX: config.blobFocalX,
        blobFocalY: config.blobFocalY,
      } : null);

      if (!dataToSave) return;

      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const updated = await apiClient.updateAdminHomeTestimonialsSection(dataToSave);
        setConfig(updated);
        setSuccess(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error al guardar los cambios";
        setError(msg);
      } finally {
        setSaving(false);
      }
    },
    [config]
  );

  return {
    config,
    loading,
    saving,
    error,
    success,
    updateField,
    saveConfig,
    handleSelectBlobMedia,
    refetch: fetchConfig,
  };
}
