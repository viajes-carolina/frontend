"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SiteSettingsDTO, apiClient } from "@vc/api-client";

export function useAdminSettings(initialSettings: SiteSettingsDTO) {
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const [baseline, setBaseline] = useState<SiteSettingsDTO>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await apiClient.updateSiteSettings(settings);
      setSettings(updated);
      setBaseline(updated);
      setSaveSuccess(true);
    } catch {
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(baseline), [settings, baseline]);

  const discardChanges = useCallback(() => setSettings(baseline), [baseline]);

  return {
    settings,
    isSaving,
    saveSuccess,
    isDirty,
    discardChanges,
    updateField,
    handleSave,
  };
}
