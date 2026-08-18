"use client";

import { useState, useEffect, useCallback } from "react";
import {
  apiClient,
  ContactPageDTO,
  UpdateContactPageRequest,
  ContactInquiryDTO,
} from "@vc/api-client";

export function useAdminContact() {
  const [pageSettings, setPageSettings] = useState<ContactPageDTO | null>(null);
  const [inquiries, setInquiries] = useState<ContactInquiryDTO[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsData, inquiriesData] = await Promise.all([
        apiClient.getAdminContact(),
        apiClient.getAdminInquiries(statusFilter),
      ]);
      setPageSettings(settingsData);
      setInquiries(inquiriesData);
    } catch (err: any) {
      setError(err?.message || "Error al cargar datos de contacto");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSettings = async (payload: UpdateContactPageRequest) => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const updated = await apiClient.updateAdminContact(payload);
      setPageSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return true;
    } catch (err: any) {
      setError(err?.message || "Error al guardar configuración");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateInquiryStatus = async (id: number, newStatus: string) => {
    try {
      const updated = await apiClient.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? updated : inq))
      );
      return true;
    } catch (err: any) {
      setError(err?.message || "Error al actualizar estado del lead");
      return false;
    }
  };

  return {
    pageSettings,
    inquiries,
    statusFilter,
    setStatusFilter,
    loading,
    saving,
    saveSuccess,
    error,
    updateSettings,
    updateInquiryStatus,
    refresh: loadData,
  };
}
