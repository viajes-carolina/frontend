import { useState, useCallback, useEffect } from "react";
import {
  apiClient,
  HomePromotionsSectionDTO,
  MediaAssetDTO,
  UpdateHomePromotionsSectionRequest,
} from "@vc/api-client";

export function useAdminPromotionsSection(initialConfig?: HomePromotionsSectionDTO) {
  const [config, setConfig] = useState<HomePromotionsSectionDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminHomePromotionsSection();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la configuración de Promociones";
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
    <K extends keyof HomePromotionsSectionDTO>(field: K, value: HomePromotionsSectionDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const handleSelectMedia = useCallback(
    (media: MediaAssetDTO) => {
      updateField("mediaId", media.id);
      updateField("mediaUrl", media.storagePath);
      updateField("mediaFocalX", media.focalX || 50);
      updateField("mediaFocalY", media.focalY || 50);
    },
    [updateField]
  );

  const saveConfig = useCallback(
    async (payload?: UpdateHomePromotionsSectionRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        title: config.title,
        subtitle: config.subtitle,
        bottomCtaQuestion: config.bottomCtaQuestion,
        bottomCtaWhatsappText: config.bottomCtaWhatsappText,
        bottomCtaWhatsappMessage: config.bottomCtaWhatsappMessage,
        mediaId: config.mediaId,
        mediaUrl: config.mediaUrl,
        mediaFocalX: config.mediaFocalX,
        mediaFocalY: config.mediaFocalY,
      } : null);

      if (!dataToSave) return;

      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const updated = await apiClient.updateAdminHomePromotionsSection(dataToSave);
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
    handleSelectMedia,
    saveConfig,
    refetch: fetchConfig,
  };
}
