"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AboutPageDTO,
  UpdateAboutPageRequest,
  JourneyStepDTO,
  AccompanyStepDTO,
  AboutMomentDTO,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";

const EMPTY_FORM: UpdateAboutPageRequest = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroMediaId: undefined,
  heroFocalX: 50,
  heroFocalY: 50,
  heroCardBadge: "",
  heroCardTitle: "",
  heroNoteText: "",
  storyTitle: "",
  storyBody: "",
  storyMediaId: undefined,
  storyFocalX: 50,
  storyFocalY: 50,
  missionTitle: "",
  missionBody: "",
  missionQuote: "",
  journeySteps: [],
  values: [],
  accompanyBadge: "",
  accompanyTitle: "",
  accompanySubtitle: "",
  accompanySteps: [],
  accompanyQuote: "",
  accompanyQuoteAttribution: "",
  momentsBadge: "",
  momentsTitle: "",
  momentsSubtitle: "",
  momentsMediaId: undefined,
  momentsFocalX: 50,
  momentsFocalY: 50,
  moments: [],
  humanBadge: "",
  humanTitle: "",
  humanSubtitle: "",
  humanTagline: "",
};

function toFormData(page: AboutPageDTO): UpdateAboutPageRequest {
  return {
    heroBadge: page.heroBadge,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle,
    heroMediaId: page.heroMediaId,
    heroFocalX: page.heroFocalX ?? 50,
    heroFocalY: page.heroFocalY ?? 50,
    heroCardBadge: page.heroCardBadge || "",
    heroCardTitle: page.heroCardTitle || "",
    heroNoteText: page.heroNoteText || "",
    storyTitle: page.storyTitle,
    storyBody: page.storyBody,
    storyMediaId: page.storyMediaId,
    storyFocalX: page.storyFocalX ?? 50,
    storyFocalY: page.storyFocalY ?? 50,
    missionTitle: page.missionTitle,
    missionBody: page.missionBody,
    missionQuote: page.missionQuote || "",
    journeySteps: page.journeySteps || [],
    values: page.values || [],
    accompanyBadge: page.accompanyBadge || "",
    accompanyTitle: page.accompanyTitle || "",
    accompanySubtitle: page.accompanySubtitle || "",
    accompanySteps: page.accompanySteps || [],
    accompanyQuote: page.accompanyQuote || "",
    accompanyQuoteAttribution: page.accompanyQuoteAttribution || "",
    momentsBadge: page.momentsBadge || "",
    momentsTitle: page.momentsTitle || "",
    momentsSubtitle: page.momentsSubtitle || "",
    momentsMediaId: page.momentsMediaId,
    momentsFocalX: page.momentsFocalX ?? 50,
    momentsFocalY: page.momentsFocalY ?? 50,
    moments: page.moments || [],
    humanBadge: page.humanBadge || "",
    humanTitle: page.humanTitle || "",
    humanSubtitle: page.humanSubtitle || "",
    humanTagline: page.humanTagline || "",
  };
}

export function useAdminAbout() {
  const [aboutPage, setAboutPage] = useState<AboutPageDTO | null>(null);
  const [formData, setFormData] = useState<UpdateAboutPageRequest>(EMPTY_FORM);
  const [heroMediaUrl, setHeroMediaUrl] = useState<string | undefined>();
  const [storyMediaUrl, setStoryMediaUrl] = useState<string | undefined>();
  const [momentsMediaUrl, setMomentsMediaUrl] = useState<string | undefined>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Textos pendientes de agregar a cada lista editable (no se persisten hasta pulsar "+ Agregar").
  const [newValueText, setNewValueText] = useState("");
  const [newJourneyStepText, setNewJourneyStepText] = useState("");
  const [newAccompanyStepTitle, setNewAccompanyStepTitle] = useState("");
  const [newAccompanyStepBody, setNewAccompanyStepBody] = useState("");
  const [newMomentTitle, setNewMomentTitle] = useState("");
  const [newMomentBody, setNewMomentBody] = useState("");

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const applyPage = (page: AboutPageDTO) => {
    setAboutPage(page);
    setFormData(toFormData(page));
    setHeroMediaUrl(page.heroMediaUrl);
    setStoryMediaUrl(page.storyMediaUrl);
    setMomentsMediaUrl(page.momentsMediaUrl);
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

  const handleSelectHeroMedia = useCallback((media: MediaAssetDTO) => {
    setFormData((prev) => ({
      ...prev,
      heroMediaId: media.id,
      heroFocalX: media.focalX ?? 50,
      heroFocalY: media.focalY ?? 50,
    }));
    setHeroMediaUrl(media.storagePath);
  }, []);

  const handleSelectStoryMedia = useCallback((media: MediaAssetDTO) => {
    setFormData((prev) => ({
      ...prev,
      storyMediaId: media.id,
      storyFocalX: media.focalX ?? 50,
      storyFocalY: media.focalY ?? 50,
    }));
    setStoryMediaUrl(media.storagePath);
  }, []);

  const handleSelectMomentsMedia = useCallback((media: MediaAssetDTO) => {
    setFormData((prev) => ({
      ...prev,
      momentsMediaId: media.id,
      momentsFocalX: media.focalX ?? 50,
      momentsFocalY: media.focalY ?? 50,
    }));
    setMomentsMediaUrl(media.storagePath);
  }, []);

  // Valores / Principios rectores
  const addValue = useCallback(() => {
    if (!newValueText.trim()) return;
    setFormData((prev) => ({ ...prev, values: [...prev.values, newValueText.trim()] }));
    setNewValueText("");
  }, [newValueText]);

  const removeValue = useCallback((index: number) => {
    setFormData((prev) => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
  }, []);

  // Ruta "de idea a recuerdo" (journeySteps)
  const addJourneyStep = useCallback(() => {
    if (!newJourneyStepText.trim()) return;
    const step: JourneyStepDTO = { label: newJourneyStepText.trim() };
    setFormData((prev) => ({ ...prev, journeySteps: [...prev.journeySteps, step] }));
    setNewJourneyStepText("");
  }, [newJourneyStepText]);

  const removeJourneyStep = useCallback((index: number) => {
    setFormData((prev) => ({ ...prev, journeySteps: prev.journeySteps.filter((_, i) => i !== index) }));
  }, []);

  // Cómo te acompañamos (accompanySteps)
  const addAccompanyStep = useCallback(() => {
    if (!newAccompanyStepTitle.trim() || !newAccompanyStepBody.trim()) return;
    const step: AccompanyStepDTO = {
      title: newAccompanyStepTitle.trim(),
      body: newAccompanyStepBody.trim(),
    };
    setFormData((prev) => ({ ...prev, accompanySteps: [...prev.accompanySteps, step] }));
    setNewAccompanyStepTitle("");
    setNewAccompanyStepBody("");
  }, [newAccompanyStepTitle, newAccompanyStepBody]);

  const removeAccompanyStep = useCallback((index: number) => {
    setFormData((prev) => ({ ...prev, accompanySteps: prev.accompanySteps.filter((_, i) => i !== index) }));
  }, []);

  // Experiencias que humanizan (moments)
  const addMoment = useCallback(() => {
    if (!newMomentTitle.trim() || !newMomentBody.trim()) return;
    const moment: AboutMomentDTO = {
      title: newMomentTitle.trim(),
      body: newMomentBody.trim(),
    };
    setFormData((prev) => ({ ...prev, moments: [...prev.moments, moment] }));
    setNewMomentTitle("");
    setNewMomentBody("");
  }, [newMomentTitle, newMomentBody]);

  const removeMoment = useCallback((index: number) => {
    setFormData((prev) => ({ ...prev, moments: prev.moments.filter((_, i) => i !== index) }));
  }, []);

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

  return {
    aboutPage,
    formData,
    heroMediaUrl,
    storyMediaUrl,
    momentsMediaUrl,
    loading,
    saving,
    feedbackMessage,
    updateField,
    handleSelectHeroMedia,
    handleSelectStoryMedia,
    handleSelectMomentsMedia,
    newValueText,
    setNewValueText,
    addValue,
    removeValue,
    newJourneyStepText,
    setNewJourneyStepText,
    addJourneyStep,
    removeJourneyStep,
    newAccompanyStepTitle,
    setNewAccompanyStepTitle,
    newAccompanyStepBody,
    setNewAccompanyStepBody,
    addAccompanyStep,
    removeAccompanyStep,
    newMomentTitle,
    setNewMomentTitle,
    newMomentBody,
    setNewMomentBody,
    addMoment,
    removeMoment,
    handleSave,
    reload: loadData,
  };
}
