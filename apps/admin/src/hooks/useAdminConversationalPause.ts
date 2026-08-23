import { useState, useCallback, useEffect } from "react";
import {
  apiClient,
  HomeConversationalPauseDTO,
  UpdateHomeConversationalPauseRequest,
} from "@vc/api-client";

export function useAdminConversationalPause(initialConfig?: HomeConversationalPauseDTO) {
  const [config, setConfig] = useState<HomeConversationalPauseDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminHomeConversationalPause();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la configuración de Pausa Conversacional";
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
    <K extends keyof HomeConversationalPauseDTO>(field: K, value: HomeConversationalPauseDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const saveConfig = useCallback(
    async (payload?: UpdateHomeConversationalPauseRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        title: config.title,
        subtitle: config.subtitle,
        whatsappCtaText: config.whatsappCtaText,
        whatsappMessageTemplate: config.whatsappMessageTemplate,
      } : null);

      if (!dataToSave) return;

      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const updated = await apiClient.updateAdminHomeConversationalPause(dataToSave);
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
    refetch: fetchConfig,
  };
}
