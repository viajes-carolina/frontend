import { useState, useCallback, useEffect } from "react";
import {
  apiClient,
  HomeBlogInspirationDTO,
  UpdateHomeBlogInspirationRequest,
} from "@vc/api-client";

export function useAdminBlogInspiration(initialConfig?: HomeBlogInspirationDTO) {
  const [config, setConfig] = useState<HomeBlogInspirationDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminHomeBlogInspiration();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la configuración de inspiración";
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
    <K extends keyof HomeBlogInspirationDTO>(field: K, value: HomeBlogInspirationDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const saveConfig = useCallback(
    async (payload?: UpdateHomeBlogInspirationRequest) => {
      const dataToSave = payload || (config ? {
        badgeText: config.badgeText,
        titleHighlight: config.titleHighlight,
        titleAccent: config.titleAccent,
        subtitle: config.subtitle,
        ctaText: config.ctaText,
        ctaUrl: config.ctaUrl,
        postsLimit: config.postsLimit,
        active: config.active,
      } : null);

      if (!dataToSave) return;

      try {
        setSaving(true);
        setError(null);
        setSuccess(false);
        const updated = await apiClient.updateAdminHomeBlogInspiration(dataToSave);
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
