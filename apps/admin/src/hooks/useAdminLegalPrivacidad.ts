import { useState, useCallback, useEffect } from "react";
import { apiClient, LegalPrivacyDTO } from "@vc/api-client";
import { addEmptySection, removeSectionAt, updateSectionField } from "../lib/legalListEditors";

export function useAdminLegalPrivacidad(initialConfig?: LegalPrivacyDTO) {
  const [config, setConfig] = useState<LegalPrivacyDTO | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminLegalPrivacidad();
      setConfig(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar la política de privacidad";
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
    <K extends keyof LegalPrivacyDTO>(field: K, value: LegalPrivacyDTO[K]) => {
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
      const updated = await apiClient.updateAdminLegalPrivacidad(config);
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
    updateSection,
    addSection,
    removeSection,
    saveConfig,
    refetch: fetchConfig,
  };
}
