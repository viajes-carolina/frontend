"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AboutPageDTO,
  UpdateAboutPageRequest,
  TravelAdvisorDTO,
  CreateOrUpdateAdvisorRequest,
  apiClient,
} from "@vc/api-client";

export function useAdminAbout() {
  const [aboutPage, setAboutPage] = useState<AboutPageDTO | null>(null);
  const [advisors, setAdvisors] = useState<TravelAdvisorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"page" | "advisors">("page");
  
  // Modals & Pickers
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<TravelAdvisorDTO | null>(null);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"hero" | "story" | "advisor" | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pageData, advisorsData] = await Promise.all([
        apiClient.getAdminAbout(),
        apiClient.getAdminAdvisors(),
      ]);
      setAboutPage(pageData);
      setAdvisors(advisorsData);
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

  const handleSavePage = async (payload: UpdateAboutPageRequest) => {
    try {
      setSaving(true);
      const updated = await apiClient.updateAdminAbout(payload);
      setAboutPage(updated);
      showFeedback("Información institucional actualizada exitosamente.");
    } catch (err) {
      console.error("Error saving about page:", err);
      showFeedback("Error al guardar los cambios de la página.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdvisor = async (payload: CreateOrUpdateAdvisorRequest) => {
    try {
      setSaving(true);
      if (editingAdvisor) {
        const updated = await apiClient.updateAdvisor(editingAdvisor.id, payload);
        setAdvisors((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        showFeedback("Asesora actualizada correctamente.");
      } else {
        const created = await apiClient.createAdvisor(payload);
        setAdvisors((prev) => [...prev, created]);
        showFeedback("Nueva asesora agregada al equipo.");
      }
      setIsAdvisorModalOpen(false);
      setEditingAdvisor(null);
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
      setAdvisors((prev) => prev.filter((a) => a.id !== id));
      showFeedback("Asesora eliminada del equipo.");
    } catch (err) {
      console.error("Error deleting advisor:", err);
      showFeedback("Error al eliminar la asesora.", "error");
    } finally {
      setSaving(false);
    }
  };

  const openCreateAdvisor = () => {
    setEditingAdvisor(null);
    setIsAdvisorModalOpen(true);
  };

  const openEditAdvisor = (advisor: TravelAdvisorDTO) => {
    setEditingAdvisor(advisor);
    setIsAdvisorModalOpen(true);
  };

  const closeAdvisorModal = () => {
    setIsAdvisorModalOpen(false);
    setEditingAdvisor(null);
  };

  return {
    aboutPage,
    advisors,
    loading,
    saving,
    activeTab,
    setActiveTab,
    isAdvisorModalOpen,
    editingAdvisor,
    mediaPickerTarget,
    setMediaPickerTarget,
    feedbackMessage,
    handleSavePage,
    handleSaveAdvisor,
    handleDeleteAdvisor,
    openCreateAdvisor,
    openEditAdvisor,
    closeAdvisorModal,
    reload: loadData,
  };
}
