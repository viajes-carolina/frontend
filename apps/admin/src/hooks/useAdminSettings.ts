"use client";

import { useState, useEffect } from "react";
import { SiteSettingsDTO, apiClient } from "@vc/api-client";

export function useAdminSettings(initialSettings: SiteSettingsDTO) {
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Refresh with latest data on mount
    apiClient.getSiteSettings().then((fresh) => {
      if (fresh) setSettings(fresh);
    });
  }, []);

  const updateField = (field: keyof SiteSettingsDTO, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await apiClient.updateSiteSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
    } catch {
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isSaving,
    saveSuccess,
    updateField,
    handleSave,
  };
}
