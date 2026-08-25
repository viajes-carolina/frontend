"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient, OfficeLocationDTO } from "@vc/api-client";

export function useAdminGoogleMapsLink() {
  const [office, setOffice] = useState<OfficeLocationDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getOfficeLocation();
      setOffice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la ubicación de Google Maps");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setGoogleMapsUrl = useCallback((value: string) => {
    setOffice((prev) => (prev ? { ...prev, googleMapsUrl: value } : prev));
    setSaveSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (!office) return;
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const updated = await apiClient.updateOfficeLocation(office);
      setOffice(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la ubicación de Google Maps");
    } finally {
      setSaving(false);
    }
  }, [office]);

  return {
    googleMapsUrl: office?.googleMapsUrl || "",
    setGoogleMapsUrl,
    loading,
    saving,
    saveSuccess,
    error,
    handleSave,
  };
}
