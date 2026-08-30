"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AboutPageDTO, UpdateAboutPageRequest, AccompanyStepDTO, apiClient } from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";

const EMPTY_FORM: UpdateAboutPageRequest = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroCardBadge: "",
  heroCardTitle: "",
  heroCardLocation: "",
  heroCardDetail: "",
  heroNoteText: "",
  accompanyBadge: "",
  accompanyTitle: "",
  accompanySubtitle: "",
  accompanySteps: [],
  accompanyQuote: "",
  advisorsBadge: "",
  advisorsHighlights: [],
};

function toFormData(page: AboutPageDTO): UpdateAboutPageRequest {
  return {
    heroBadge: page.heroBadge,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle,
    heroCardBadge: page.heroCardBadge || "",
    heroCardTitle: page.heroCardTitle || "",
    heroCardLocation: page.heroCardLocation || "",
    heroCardDetail: page.heroCardDetail || "",
    heroNoteText: page.heroNoteText || "",
    accompanyBadge: page.accompanyBadge || "",
    accompanyTitle: page.accompanyTitle || "",
    accompanySubtitle: page.accompanySubtitle || "",
    accompanySteps: page.accompanySteps || [],
    accompanyQuote: page.accompanyQuote || "",
    advisorsBadge: page.advisorsBadge || "",
    advisorsHighlights: page.advisorsHighlights || [],
  };
}

// Los 3 campos fijos de "accompanySteps" y los 2 de "advisorsHighlights" son
// listas de tamaño constante en el nuevo diseño (ya no listas libres) — se
// completan con entradas vacías si el backend todavía no los envía completos,
// para que el formulario siempre tenga la cantidad correcta de campos.
function padSteps(steps: AccompanyStepDTO[], size: number): AccompanyStepDTO[] {
  const padded = [...steps];
  while (padded.length < size) padded.push({ title: "", body: "" });
  return padded.slice(0, size);
}

export function useAdminAbout() {
  const [aboutPage, setAboutPage] = useState<AboutPageDTO | null>(null);
  const [formData, setFormData] = useState<UpdateAboutPageRequest>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const applyPage = (page: AboutPageDTO) => {
    setAboutPage(page);
    const data = toFormData(page);
    setFormData({
      ...data,
      accompanySteps: padSteps(data.accompanySteps, 3),
      advisorsHighlights: padSteps(data.advisorsHighlights, 2),
    });
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const page = await apiClient.getAdminAbout();
      applyPage(page);
    } catch (err) {
      console.error("Error loading about admin data:", err);
      showFeedback("Error al cargar la información institucional.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateField = useCallback(
    <K extends keyof UpdateAboutPageRequest>(field: K, value: UpdateAboutPageRequest[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Cómo te acompañamos (3 pasos fijos)
  const updateAccompanyStep = useCallback((index: number, field: keyof AccompanyStepDTO, value: string) => {
    setFormData((prev) => {
      const steps = padSteps(prev.accompanySteps, 3);
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, accompanySteps: steps };
    });
  }, []);

  // Voces de apoyo del equipo (2 destacados fijos)
  const updateAdvisorsHighlight = useCallback((index: number, field: keyof AccompanyStepDTO, value: string) => {
    setFormData((prev) => {
      const items = padSteps(prev.advisorsHighlights, 2);
      items[index] = { ...items[index], [field]: value };
      return { ...prev, advisorsHighlights: items };
    });
  }, []);

  // Comparación directa formData vs. el snapshot ya guardado (convertido al
  // mismo shape con toFormData) — evita tener que trackear "dirty" campo por
  // campo mientras el editor navega entre secciones.
  const isDirty = useMemo(
    () => aboutPage != null && JSON.stringify(formData) !== JSON.stringify(toFormData(aboutPage)),
    [formData, aboutPage]
  );

  const discardChanges = useCallback(() => {
    if (aboutPage) applyPage(aboutPage);
  }, [aboutPage]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const updated = await apiClient.updateAdminAbout(formData);
      applyPage(updated);
      showFeedback("Información institucional actualizada exitosamente.");
    } catch (err) {
      console.error("Error saving about page:", err);
      showFeedback("Error al guardar los cambios de la página.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Forma única que consume `FormFeedback`. El estado interno sigue siendo
  // `{text, type}` por comodidad de los `setFeedbackMessage` de arriba, pero
  // hacia fuera solo se expone `feedback`: ya no queda ningún consumidor del
  // banner antiguo.
  const feedback = useMemo<FormFeedbackState | null>(
    () => (feedbackMessage ? { tone: feedbackMessage.type, message: feedbackMessage.text } : null),
    [feedbackMessage]
  );

  return {
    aboutPage,
    formData,
    loading,
    saving,
    feedback,
    isDirty,
    discardChanges,
    updateField,
    updateAccompanyStep,
    updateAdvisorsHighlight,
    handleSave,
    reload: loadData,
  };
}
