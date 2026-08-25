"use client";

import { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { apiClient, ContactPageDTO, UpdateContactPageRequest, StarterPhraseDTO } from "@vc/api-client";

const EMPTY_FORM: UpdateContactPageRequest = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroCtaText: "",
  heroNoteText: "",
  heroCtaMessage: "",
  heroChatLabel: "",
  heroChatBubble1: "",
  heroChatBubble2: "",
  heroChatBubble3: "",
  startersBadge: "",
  startersTitle: "",
  startersSubtitle: "",
  startersClosing: "",
  starterPhrases: [],
  officeSectionBadge: "",
  officeSectionTitle: "",
  officeSectionSubtitle: "",
  officeMapTitle: "",
  officeMapSubtitle: "",
  officeVisitNote: "",
  officeMapEyebrow: "",
  officeMapPinTitle: "",
  officeMapPinSubtitle: "",
  officeMapsLinkText: "",
  officeLocationLabel: "",
  officeVisitLabel: "",
  officeVisitCtaText: "",
  officeVisitCtaMessage: "",
};

function toFormData(page: ContactPageDTO): UpdateContactPageRequest {
  return {
    heroBadge: page.heroBadge,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle,
    heroCtaText: page.heroCtaText,
    heroNoteText: page.heroNoteText,
    heroCtaMessage: page.heroCtaMessage,
    heroChatLabel: page.heroChatLabel,
    heroChatBubble1: page.heroChatBubble1,
    heroChatBubble2: page.heroChatBubble2,
    heroChatBubble3: page.heroChatBubble3,
    startersBadge: page.startersBadge,
    startersTitle: page.startersTitle,
    startersSubtitle: page.startersSubtitle,
    startersClosing: page.startersClosing,
    starterPhrases: page.starterPhrases || [],
    officeSectionBadge: page.officeSectionBadge,
    officeSectionTitle: page.officeSectionTitle,
    officeSectionSubtitle: page.officeSectionSubtitle,
    officeMapTitle: page.officeMapTitle,
    officeMapSubtitle: page.officeMapSubtitle,
    officeVisitNote: page.officeVisitNote,
    officeMapEyebrow: page.officeMapEyebrow,
    officeMapPinTitle: page.officeMapPinTitle,
    officeMapPinSubtitle: page.officeMapPinSubtitle,
    officeMapsLinkText: page.officeMapsLinkText,
    officeLocationLabel: page.officeLocationLabel,
    officeVisitLabel: page.officeVisitLabel,
    officeVisitCtaText: page.officeVisitCtaText,
    officeVisitCtaMessage: page.officeVisitCtaMessage,
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

  // Frases de ejemplo de "Cómo empezar" (starterPhrases)
  const addStarterPhrase = useCallback(() => {
    const phrase: StarterPhraseDTO = { quote: "", support: "" };
    setFormData((prev) => ({ ...prev, starterPhrases: [...prev.starterPhrases, phrase] }));
  }, []);

  const removeStarterPhrase = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      starterPhrases: prev.starterPhrases.filter((_, i) => i !== index),
    }));
  }, []);

  const updateStarterPhrase = useCallback(
    (index: number, field: keyof StarterPhraseDTO, value: string) => {
      setFormData((prev) => ({
        ...prev,
        starterPhrases: prev.starterPhrases.map((phrase, i) =>
          i === index ? { ...phrase, [field]: value } : phrase
        ),
      }));
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

  return {
    pageSettings,
    formData,
    updateField,
    addStarterPhrase,
    removeStarterPhrase,
    updateStarterPhrase,
    loading,
    saving,
    saveSuccess,
    error,
    handleSaveSettings,
    refresh: loadData,
  };
}
