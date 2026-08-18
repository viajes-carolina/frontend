"use client";

import { useState, useEffect } from "react";
import { OfficeLocationDTO, apiClient } from "@vc/api-client";

export function useAdminOffice(initialOffice: OfficeLocationDTO) {
  const [office, setOffice] = useState<OfficeLocationDTO>(initialOffice);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Refresh with latest data on mount
    apiClient.getOfficeLocation().then((fresh) => {
      if (fresh) setOffice(fresh);
    });
  }, []);

  const updateField = (field: keyof OfficeLocationDTO, value: string | number | boolean) => {
    setOffice((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await apiClient.updateOfficeLocation(office);
      setOffice(updated);
      setSaveSuccess(true);
    } catch {
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    office,
    isSaving,
    saveSuccess,
    updateField,
    handleSave,
  };
}
