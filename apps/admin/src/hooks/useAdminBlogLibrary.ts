import { useState, useCallback, useEffect, useMemo } from "react";
import { buildFormFeedback } from "../lib/formFeedback";
import { apiClient, BlogLibraryDTO } from "@vc/api-client";

export function useAdminBlogLibrary(initialConfig?: BlogLibraryDTO) {
  const [config, setConfig] = useState<BlogLibraryDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminBlogLibrary();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la sección \"Biblioteca\"";
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
    <K extends keyof BlogLibraryDTO>(field: K, value: BlogLibraryDTO[K]) => {
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
      const updated = await apiClient.updateAdminBlogLibrary(config);
      setConfig(updated);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar los cambios";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [config]);

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
