"use client";

import { useState, useEffect } from "react";
import {
  FaqItemDTO,
  CreateOrUpdateFaqRequest,
  apiClient,
} from "@vc/api-client";

export function useAdminFaqItems(initialFaqs: FaqItemDTO[]) {
  const [faqs, setFaqs] = useState<FaqItemDTO[]>(initialFaqs);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
    setStatusMessage(null);

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
        setStatusMessage(`FAQ actualizada.`);
      } else {
        await apiClient.createFaq(payload);
        setStatusMessage(`Pregunta frecuente creada con éxito.`);
      }
      setIsFaqModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar FAQ.");
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("¿Desactivar esta pregunta frecuente?")) return;
    try {
      await apiClient.deleteFaq(id);
      setStatusMessage("Pregunta frecuente desactivada.");
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al desactivar FAQ.");
    }
  };

  return {
    faqs,
    isLoading,
    statusMessage,
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
