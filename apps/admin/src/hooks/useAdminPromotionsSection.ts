import { useState, useCallback, useEffect, useMemo } from "react";
import { buildFormFeedback } from "../lib/formFeedback";
import {
  apiClient,
  HomePromotionsSectionDTO,
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

  const saveConfig = useCallback(
    async (payload?: UpdateHomePromotionsSectionRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        title: config.title,
        subtitle: config.subtitle,
        bottomCtaQuestion: config.bottomCtaQuestion,
        bottomCtaEyebrow: config.bottomCtaEyebrow,
        bottomCtaCopy: config.bottomCtaCopy,
        bottomCtaWhatsappText: config.bottomCtaWhatsappText,
        bottomCtaWhatsappMessage: config.bottomCtaWhatsappMessage,
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

  // Forma única de feedback que consume `FormFeedback` (banner con
  // `role="status"`): un error de guardado gana sobre el éxito previo.
  const feedback = useMemo(
    () => buildFormFeedback(error, success, "Configuración guardada exitosamente en el servidor."),
    [error, success]
  );

  return {
    config,
    loading,
    saving,
    error,
    success,
    feedback,
    updateField,
    saveConfig,
    refetch: fetchConfig,
  };
}
