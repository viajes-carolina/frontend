import { useState, useCallback, useEffect, useMemo } from "react";
import { buildFormFeedback } from "../lib/formFeedback";
import { apiClient, LegalMinceturDTO } from "@vc/api-client";
import { addEmptySection, removeSectionAt, updateSectionField } from "../lib/legalListEditors";

export function useAdminLegalMincetur(initialConfig?: LegalMinceturDTO) {
  const [config, setConfig] = useState<LegalMinceturDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminLegalMincetur();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la Constancia MINCETUR";
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
    <K extends keyof LegalMinceturDTO>(field: K, value: LegalMinceturDTO[K]) => {
      setConfig((prev) => (prev ? { ...prev, [field]: value } : null));
      setSuccess(false);
      setError(null);
    },
    []
  );

  const updateSection = useCallback((index: number, field: "title" | "body", value: string) => {
    setConfig((prev) => (prev ? updateSectionField(prev, index, field, value) : null));
    setSuccess(false);
  }, []);

  const addSection = useCallback(() => {
    setConfig((prev) => (prev ? addEmptySection(prev) : null));
    setSuccess(false);
  }, []);

  const removeSection = useCallback((index: number) => {
    setConfig((prev) => (prev ? removeSectionAt(prev, index) : null));
    setSuccess(false);
  }, []);

  const saveConfig = useCallback(async () => {
    if (!config) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      const updated = await apiClient.updateAdminLegalMincetur(config);
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
    () => buildFormFeedback(error, success, "Cambios guardados correctamente."),
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
    updateSection,
    addSection,
    removeSection,
    saveConfig,
    refetch: fetchConfig,
  };
}
