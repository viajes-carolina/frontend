"use client";

import { useState, useEffect } from "react";
import { useConfirmDialog, type FormFeedbackState } from "@vc/ui";
import {
  TestimonialDTO,
  CreateOrUpdateTestimonialRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";

export function useAdminTestimonialItems(initialTestimonials: TestimonialDTO[]) {
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>(initialTestimonials);
  const [isLoading, setIsLoading] = useState(false);
  // Antes era un `statusMessage: string` único, así que los mensajes de error
  // se pintaban en el banner verde de éxito. El tono los distingue.
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedbackState | null>(null);
  const showSuccess = (message: string) => setFeedback({ tone: "success", message });
  const showError = (message: string) => setFeedback({ tone: "error", message });
  const deactivateConfirmation = useConfirmDialog();

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

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const list = await apiClient.getTestimonials();
      setTestimonials(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
    setFeedback(null);
    setSaving(true);

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
        showSuccess(`Testimonio de "${clientName}" actualizado.`);
      } else {
        await apiClient.createTestimonial(payload);
        showSuccess(`Testimonio de "${clientName}" creado con éxito.`);
      }
      setIsTestimonialModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error(err);
      showError("Error al guardar testimonio.");
    } finally {
      setSaving(false);
    }
  };

  const deactivateTestimonial = async (testimonial: TestimonialDTO) => {
    try {
      setSaving(true);
      await apiClient.deleteTestimonial(testimonial.id);
      showSuccess(`El testimonio de "${testimonial.clientName}" quedó desactivado.`);
      await refreshData();
    } catch (err) {
      console.error(err);
      showError(
        `No se pudo desactivar el testimonio de "${testimonial.clientName}". Sigue visible en el sitio.`
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Antes preguntaba con `confirm("¿Desactivar este testimonio?")`, que no
   * decía de quién. Ahora el título nombra al cliente —lo único que identifica
   * una fila de esa tabla de un vistazo— y el cuerpo aclara que se retira de
   * la sección de Experiencias sin borrarse.
   */
  const handleDeleteTestimonial = (testimonial: TestimonialDTO) => {
    deactivateConfirmation.ask({
      title: `¿Desactivar el testimonio de "${testimonial.clientName}"?`,
      description:
        "Dejará de mostrarse en la sección de Experiencias del sitio público. No se borra: sigue en esta tabla y puedes reactivarlo cuando quieras.",
      confirmLabel: "Sí, desactivar",
      busyLabel: "Desactivando…",
      onConfirm: () => deactivateTestimonial(testimonial),
    });
  };

  return {
    testimonials,
    /** Props para `<ConfirmDialog {...deactivateConfirmation} />`. */
    deactivateConfirmation: deactivateConfirmation.dialogProps,
    isLoading,
    /**
     * Cuándo pintar el esqueleto. NO es `isLoading` a secas: la pantalla llega
     * con los testimonios ya renderizados desde el servidor y el refresco de
     * montaje taparía con un esqueleto una tabla que ya se estaba leyendo.
     */
    loading: isLoading && testimonials.length === 0,
    saving,
    feedback,
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
  };
}
