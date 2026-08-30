import { useState, useCallback, useEffect, useMemo } from "react";
import { buildFormFeedback } from "../lib/formFeedback";
import {
  apiClient,
  HomeFaqSectionDTO,
  UpdateHomeFaqSectionRequest,
} from "@vc/api-client";

export function useAdminFaqSection(initialConfig?: HomeFaqSectionDTO) {
  const [config, setConfig] = useState<HomeFaqSectionDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminHomeFaqSection();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la configuración de FAQ";
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
    <K extends keyof HomeFaqSectionDTO>(field: K, value: HomeFaqSectionDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const saveConfig = useCallback(
    async (payload?: UpdateHomeFaqSectionRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        title: config.title,
        subtitle: config.subtitle,
      } : null);

      if (!dataToSave) return;

      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const updated = await apiClient.updateAdminHomeFaqSection(dataToSave);
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
