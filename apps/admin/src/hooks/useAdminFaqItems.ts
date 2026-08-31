"use client";

import { useState, useEffect } from "react";
import { useConfirmDialog, type FormFeedbackState } from "@vc/ui";
import {
  FaqItemDTO,
  CreateOrUpdateFaqRequest,
  apiClient,
} from "@vc/api-client";
import { confirmSubject } from "../lib/confirmSubject";

export function useAdminFaqItems(initialFaqs: FaqItemDTO[]) {
  const [faqs, setFaqs] = useState<FaqItemDTO[]>(initialFaqs);
  const [isLoading, setIsLoading] = useState(false);
  // Antes era un `statusMessage: string` único, así que los mensajes de error
  // se pintaban en el banner verde de éxito. El tono los distingue.
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);
  const showSuccess = (message: string) => setFeedback({ tone: "success", message });
  const showError = (message: string) => setFeedback({ tone: "error", message });
  const deactivateConfirmation = useConfirmDialog();

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItemDTO | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [faqDisplayOrder, setFaqDisplayOrder] = useState(0);
  const [faqActive, setFaqActive] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const list = await apiClient.getFaqs();
      setFaqs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const openCreateFaq = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("Asesoría y Pagos");
    setFaqDisplayOrder(faqs.length + 1);
    setFaqActive(true);
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FaqItemDTO) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category || "General");
    setFaqDisplayOrder(f.displayOrder || 0);
    setFaqActive(f.active);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    const payload: CreateOrUpdateFaqRequest = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      displayOrder: Number(faqDisplayOrder),
      active: faqActive,
    };

    try {
      if (editingFaq) {
        await apiClient.updateFaq(editingFaq.id, payload);
        showSuccess("FAQ actualizada.");
      } else {
        await apiClient.createFaq(payload);
        showSuccess("Pregunta frecuente creada con éxito.");
      }
      setIsFaqModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error(err);
      showError("Error al guardar FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const deactivateFaq = async (faq: FaqItemDTO) => {
    try {
      setSaving(true);
      await apiClient.deleteFaq(faq.id);
      showSuccess("La pregunta quedó desactivada y ya no aparece en el acordeón.");
      await refreshData();
    } catch (err) {
      console.error(err);
      showError("No se pudo desactivar la pregunta. Sigue publicada en el acordeón.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Antes preguntaba con `confirm("¿Desactivar esta pregunta frecuente?")`:
   * "esta" no identificaba nada en una tabla de veinte filas. El título cita
   * ahora la pregunta —recortada, porque son frases largas— y el cuerpo dice
   * que se retira del acordeón sin borrarse.
   */
  const handleDeleteFaq = (faq: FaqItemDTO) => {
    deactivateConfirmation.ask({
      title: `¿Desactivar "${confirmSubject(faq.question)}"?`,
      description:
        "La pregunta dejará de mostrarse en el acordeón del sitio público. No se borra: sigue en esta tabla y puedes reactivarla cuando quieras.",
      confirmLabel: "Sí, desactivar",
      busyLabel: "Desactivando…",
      onConfirm: () => deactivateFaq(faq),
    });
  };

  return {
    faqs,
    /** Props para `<ConfirmDialog {...deactivateConfirmation} />`. */
    deactivateConfirmation: deactivateConfirmation.dialogProps,
    isLoading,
    /**
     * Cuándo pintar el esqueleto de la tabla. NO es `isLoading` a secas: la
     * pantalla llega con las preguntas ya renderizadas desde el servidor y el
     * refresco de montaje volvería a poner `isLoading` en `true`, tapando con
     * un esqueleto una tabla que ya se estaba leyendo. Solo hay esqueleto
     * cuando de verdad no hay nada que mostrar.
     */
    loading: isLoading && faqs.length === 0,
    saving,
    feedback,
    isFaqModalOpen, setIsFaqModalOpen,
    editingFaq,
    question, setQuestion,
    answer, setAnswer,
    category, setCategory,
    faqDisplayOrder, setFaqDisplayOrder,
    faqActive, setFaqActive,
    openCreateFaq, openEditFaq,
    handleSaveFaq, handleDeleteFaq,
  };
}
