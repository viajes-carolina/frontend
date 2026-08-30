"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TravelAdvisorDTO,
  CreateOrUpdateAdvisorRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";
import type { FormFeedbackState } from "@vc/ui";

export function useAdminAdvisors() {
  const [advisors, setAdvisors] = useState<TravelAdvisorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<TravelAdvisorDTO | null>(null);

  // Estado de la foto de perfil — mismo patrón (media: MediaAssetDTO) => {...}
  // ya usado en useAdminBlog.ts para portada/avatar.
  const [photoMediaId, setPhotoMediaId] = useState<number | undefined>(undefined);
  const [photoMediaUrl, setPhotoMediaUrl] = useState<string | undefined>(undefined);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAdminAdvisors();
      setAdvisors(data);
    } catch (err) {
      console.error("Error loading advisors:", err);
      showFeedback("Error al cargar el equipo de asesoras.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateAdvisor = () => {
    setEditingAdvisor(null);
    setPhotoMediaId(undefined);
    setPhotoMediaUrl(undefined);
    setIsModalOpen(true);
  };

  const openEditAdvisor = (advisor: TravelAdvisorDTO) => {
    setEditingAdvisor(advisor);
    setPhotoMediaId(advisor.photoMediaId);
    setPhotoMediaUrl(advisor.photoMediaUrl);
    setIsModalOpen(true);
  };

  const closeAdvisorModal = () => {
    setIsModalOpen(false);
    setEditingAdvisor(null);
  };

  const handleSelectPhoto = (media: MediaAssetDTO) => {
    setPhotoMediaId(media.id);
    setPhotoMediaUrl(media.storagePath);
  };

  const handleSaveAdvisor = async (payload: CreateOrUpdateAdvisorRequest) => {
    try {
      setSaving(true);
      if (editingAdvisor) {
        await apiClient.updateAdvisor(editingAdvisor.id, payload);
        showFeedback("Asesora actualizada correctamente.");
      } else {
        await apiClient.createAdvisor(payload);
        showFeedback("Nueva asesora agregada al equipo.");
      }
      closeAdvisorModal();
      await loadData();
    } catch (err) {
      console.error("Error saving advisor:", err);
      showFeedback("Error al guardar la asesora.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdvisor = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta asesora del equipo?")) return;
    try {
      setSaving(true);
      await apiClient.deleteAdvisor(id);
      showFeedback("Asesora eliminada del equipo.");
      await loadData();
    } catch (err) {
      console.error("Error deleting advisor:", err);
      showFeedback("Error al eliminar la asesora.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Forma única que consume `FormFeedback` (aporta el `role="status"` que el
  // banner anterior no tenía; además usaba tonos oscuros sobre fondo claro).
  const feedback = useMemo<FormFeedbackState | null>(
    () => (feedbackMessage ? { tone: feedbackMessage.type, message: feedbackMessage.text } : null),
    [feedbackMessage]
  );

  return {
    advisors,
    loading,
    saving,
    feedback,
    isModalOpen,
    editingAdvisor,
    photoMediaId,
    photoMediaUrl,
    handleSelectPhoto,
    openCreateAdvisor,
    openEditAdvisor,
    closeAdvisorModal,
    handleSaveAdvisor,
    handleDeleteAdvisor,
    reload: loadData,
  };
}
