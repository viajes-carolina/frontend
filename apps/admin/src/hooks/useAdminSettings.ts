"use client";

import { useState } from "react";
import { SiteSettingsDTO } from "@vc/api-client";

export function useAdminSettings(initialSettings: SiteSettingsDTO) {
  const [settings, setSettings] = useState<SiteSettingsDTO>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    // In local dev/mock or real API
    try {
      await new Promise((r) => setTimeout(r, 600));
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
