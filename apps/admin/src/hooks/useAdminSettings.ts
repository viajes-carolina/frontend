"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SiteSettingsDTO, apiClient } from "@vc/api-client";
import { buildFormFeedback } from "../lib/formFeedback";

const SAVE_SUCCESS_MESSAGE = "Cambios guardados correctamente y sincronizados con la web pública.";

export function useAdminSettings(initialSettings: SiteSettingsDTO) {
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const [baseline, setBaseline] = useState<SiteSettingsDTO>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Antes un guardado fallido solo apagaba `saveSuccess`: la pantalla se
  // quedaba muda y parecía que no había pasado nada.
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Refresh with latest data on mount
    apiClient.getSiteSettings().then((fresh) => {
      if (fresh) {
        setSettings(fresh);
        setBaseline(fresh);
      }
    });
  }, []);

  const updateField = (field: keyof SiteSettingsDTO, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await apiClient.updateSiteSettings(settings);
      setSettings(updated);
      setBaseline(updated);
      setSaveSuccess(true);
    } catch (err: unknown) {
      setSaveSuccess(false);
      setSaveError(err instanceof Error ? err.message : "Error al guardar la configuración del sitio.");
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(baseline), [settings, baseline]);

  const discardChanges = useCallback(() => setSettings(baseline), [baseline]);

  const feedback = useMemo(
    () => buildFormFeedback(saveError, saveSuccess, SAVE_SUCCESS_MESSAGE),
    [saveError, saveSuccess]
  );

  return {
    settings,
    isSaving,
    saveSuccess,
    feedback,
    isDirty,
    discardChanges,
    updateField,
    handleSave,
  };
}
