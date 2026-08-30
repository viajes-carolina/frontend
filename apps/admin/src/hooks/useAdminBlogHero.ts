import { useState, useCallback, useEffect } from "react";
import { apiClient, BlogHeroConfigDTO } from "@vc/api-client";

export function useAdminBlogHero(initialConfig?: BlogHeroConfigDTO) {
  const [config, setConfig] = useState<BlogHeroConfigDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminBlogHero();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la portada del blog";
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
    <K extends keyof BlogHeroConfigDTO>(field: K, value: BlogHeroConfigDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const saveConfig = useCallback(async () => {
    if (!config) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      const updated = await apiClient.updateAdminBlogHero(config);
      setConfig(updated);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar los cambios";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [config]);

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
