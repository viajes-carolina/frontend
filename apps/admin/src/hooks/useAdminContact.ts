"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormEvent } from "react";
import { apiClient, ContactPageDTO, UpdateContactPageRequest } from "@vc/api-client";
import { buildFormFeedback } from "../lib/formFeedback";

const EMPTY_FORM: UpdateContactPageRequest = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroCtaText: "",
  heroNoteText: "",
  heroCtaMessage: "",
  heroInfoTitle: "",
  heroInfoWhatsappLabel: "",
  heroInfoWhatsappValue: "",
  heroInfoEmailLabel: "",
  heroInfoScheduleLabel: "",
  heroInfoOfficeLabel: "",
  officeSectionBadge: "",
  officeSectionTitle: "",
  officeMapTitle: "",
  officeVisitNote: "",
  officeMapEyebrow: "",
  officeMapPinTitle: "",
  officeMapPinSubtitle: "",
  officeMapsLinkText: "",
  officeVisitLabel: "",
};

function toFormData(page: ContactPageDTO): UpdateContactPageRequest {
  return {
    heroBadge: page.heroBadge,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle,
    heroCtaText: page.heroCtaText,
    heroNoteText: page.heroNoteText,
    heroCtaMessage: page.heroCtaMessage,
    heroInfoTitle: page.heroInfoTitle,
    heroInfoWhatsappLabel: page.heroInfoWhatsappLabel,
    heroInfoWhatsappValue: page.heroInfoWhatsappValue,
    heroInfoEmailLabel: page.heroInfoEmailLabel,
    heroInfoScheduleLabel: page.heroInfoScheduleLabel,
    heroInfoOfficeLabel: page.heroInfoOfficeLabel,
    officeSectionBadge: page.officeSectionBadge,
    officeSectionTitle: page.officeSectionTitle,
    officeMapTitle: page.officeMapTitle,
    officeVisitNote: page.officeVisitNote,
    officeMapEyebrow: page.officeMapEyebrow,
    officeMapPinTitle: page.officeMapPinTitle,
    officeMapPinSubtitle: page.officeMapPinSubtitle,
    officeMapsLinkText: page.officeMapsLinkText,
    officeVisitLabel: page.officeVisitLabel,
  };
}

export function useAdminContact() {
  const [pageSettings, setPageSettings] = useState<ContactPageDTO | null>(null);
  const [formData, setFormData] = useState<UpdateContactPageRequest>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const settingsData = await apiClient.getAdminContact();
      setPageSettings(settingsData);
      setFormData(toFormData(settingsData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos de contacto");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateField = useCallback(
    <K extends keyof UpdateContactPageRequest>(field: K, value: UpdateContactPageRequest[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSaveSettings = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const updated = await apiClient.updateAdminContact(formData);
      setPageSettings(updated);
      setFormData(toFormData(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar configuración");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Comparación directa formData vs. el snapshot ya guardado (convertido al
  // mismo shape con toFormData) — evita tener que trackear "dirty" campo por
  // campo mientras el editor navega entre secciones.
  const isDirty = useMemo(
    () => pageSettings != null && JSON.stringify(formData) !== JSON.stringify(toFormData(pageSettings)),
    [formData, pageSettings]
  );

  const discardChanges = useCallback(() => {
    if (pageSettings) setFormData(toFormData(pageSettings));
  }, [pageSettings]);

  // Forma única de feedback que consume `FormFeedback`.
  const feedback = useMemo(
    () => buildFormFeedback(error, saveSuccess, "Configuración de Contacto actualizada con éxito."),
    [error, saveSuccess]
  );

  return {
    pageSettings,
    formData,
    updateField,
    loading,
    saving,
    saveSuccess,
    error,
    feedback,
    isDirty,
    discardChanges,
    handleSaveSettings,
    refresh: loadData,
  };
}
