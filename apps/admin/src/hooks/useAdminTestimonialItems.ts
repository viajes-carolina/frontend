"use client";

import { useState, useEffect } from "react";
import {
  TestimonialDTO,
  CreateOrUpdateTestimonialRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";

export function useAdminTestimonialItems(initialTestimonials: TestimonialDTO[]) {
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>(initialTestimonials);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  return {
    testimonials,
    isLoading,
    statusMessage,
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
