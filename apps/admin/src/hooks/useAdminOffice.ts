"use client";

import { useState } from "react";
import { OfficeLocationDTO } from "@vc/api-client";

export function useAdminOffice(initialOffice: OfficeLocationDTO) {
  const [office, setOffice] = useState<OfficeLocationDTO>(initialOffice);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      await new Promise((r) => setTimeout(r, 600));
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
