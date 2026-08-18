"use client";

import { useState, useEffect } from "react";
import {
  TestimonialDTO,
  CreateOrUpdateTestimonialRequest,
  FaqItemDTO,
  CreateOrUpdateFaqRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";

export function useAdminTrust(initialTestimonials: TestimonialDTO[], initialFaqs: FaqItemDTO[]) {
  const [activeTab, setActiveTab] = useState<"testimonials" | "faqs">("testimonials");
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FaqItemDTO[]>(initialFaqs);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Testimonial Modal & Form State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialDTO | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientLocation, setClientLocation] = useState("");
  const [tripDestination, setTripDestination] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [avatarMediaId, setAvatarMediaId] = useState<number | undefined>(undefined);
  const [avatarMediaUrl, setAvatarMediaUrl] = useState<string | undefined>(undefined);
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [testimonialDisplayOrder, setTestimonialDisplayOrder] = useState(0);
  const [testimonialActive, setTestimonialActive] = useState(true);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // FAQ Modal & Form State
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
      const [tList, fList] = await Promise.all([
        apiClient.getTestimonials(),
        apiClient.getFaqs(),
      ]);
      setTestimonials(tList);
      setFaqs(fList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Testimonial Handlers
  const openCreateTestimonial = () => {
    setEditingTestimonial(null);
    setClientName("");
    setClientLocation("Lima, Perú");
    setTripDestination("");
    setComment("");
    setRating(5);
    setAvatarMediaId(undefined);
    setAvatarMediaUrl(undefined);
    setConsentConfirmed(true);
    setTestimonialDisplayOrder(testimonials.length + 1);
    setTestimonialActive(true);
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (t: TestimonialDTO) => {
    setEditingTestimonial(t);
    setClientName(t.clientName);
    setClientLocation(t.clientLocation || "");
    setTripDestination(t.tripDestination);
    setComment(t.comment);
    setRating(t.rating);
    setAvatarMediaId(t.avatarMediaId);
    setAvatarMediaUrl(t.avatarMediaUrl);
    setConsentConfirmed(t.consentConfirmed);
    setTestimonialDisplayOrder(t.displayOrder || 0);
    setTestimonialActive(t.active);
    setIsTestimonialModalOpen(true);
  };

  const handleSelectAvatar = (media: MediaAssetDTO) => {
    setAvatarMediaId(media.id);
    setAvatarMediaUrl(media.storagePath);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const payload: CreateOrUpdateTestimonialRequest = {
      clientName: clientName.trim(),
      clientLocation: clientLocation.trim() || undefined,
      tripDestination: tripDestination.trim(),
      comment: comment.trim(),
      rating: Number(rating),
      avatarMediaId,
      consentConfirmed,
      displayOrder: Number(testimonialDisplayOrder),
      active: testimonialActive,
    };

    try {
      if (editingTestimonial) {
        await apiClient.updateTestimonial(editingTestimonial.id, payload);
        setStatusMessage(`Testimonio de "${clientName}" actualizado.`);
      } else {
        await apiClient.createTestimonial(payload);
        setStatusMessage(`Testimonio de "${clientName}" creado con éxito.`);
      }
      setIsTestimonialModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar testimonio.");
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("¿Desactivar este testimonio?")) return;
    try {
      await apiClient.deleteTestimonial(id);
      setStatusMessage("Testimonio desactivado.");
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al desactivar testimonio.");
    }
  };

  // FAQ Handlers
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
    activeTab, setActiveTab,
    testimonials, faqs,
    isLoading, statusMessage,
    // Testimonials
    isTestimonialModalOpen, setIsTestimonialModalOpen,
    editingTestimonial,
    clientName, setClientName,
    clientLocation, setClientLocation,
    tripDestination, setTripDestination,
    comment, setComment,
    rating, setRating,
    avatarMediaId, avatarMediaUrl,
    consentConfirmed, setConsentConfirmed,
    testimonialDisplayOrder, setTestimonialDisplayOrder,
    testimonialActive, setTestimonialActive,
    isAvatarPickerOpen, setIsAvatarPickerOpen,
    openCreateTestimonial, openEditTestimonial,
    handleSelectAvatar, handleSaveTestimonial, handleDeleteTestimonial,
    // FAQs
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
