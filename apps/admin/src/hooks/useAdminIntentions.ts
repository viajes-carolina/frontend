"use client";

import { useState, useEffect } from "react";
import {
  TravelIntentionDTO,
  CreateOrUpdateTravelIntentionRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";

export function useAdminIntentions(initialIntentions: TravelIntentionDTO[]) {
  const [intentions, setIntentions] = useState<TravelIntentionDTO[]>(initialIntentions);
  const [isLoading, setIsLoading] = useState(false);
  const [editingIntention, setEditingIntention] = useState<TravelIntentionDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form State
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [iconName, setIconName] = useState("SunIcon");
  const [destinationsInput, setDestinationsInput] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [coverMediaId, setCoverMediaId] = useState<number | undefined>(undefined);
  const [coverMediaUrl, setCoverMediaUrl] = useState<string | undefined>(undefined);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const refreshList = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getAdminTravelIntentions();
      setIntentions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const openCreateModal = () => {
    setEditingIntention(null);
    setSlug("");
    setTitle("");
    setTagline("");
    setIconName("SunIcon");
    setDestinationsInput("");
    setWhatsappTemplate("Hola Viajes Carolina, me interesa cotizar un viaje de [Tipo]. ¿Qué opciones tienen?");
    setCoverMediaId(undefined);
    setCoverMediaUrl(undefined);
    setDisplayOrder(intentions.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TravelIntentionDTO) => {
    setEditingIntention(item);
    setSlug(item.slug);
    setTitle(item.title);
    setTagline(item.tagline);
    setIconName(item.iconName || "SunIcon");
    setDestinationsInput((item.featuredDestinations || []).join(", "));
    setWhatsappTemplate(item.whatsappMessageTemplate);
    setCoverMediaId(item.coverMediaId);
    setCoverMediaUrl(item.coverMediaUrl);
    setDisplayOrder(item.displayOrder);
    setActive(item.active);
    setIsModalOpen(true);
  };

  const handleSelectMedia = (media: MediaAssetDTO) => {
    setCoverMediaId(media.id);
    setCoverMediaUrl(media.storagePath);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const destList = destinationsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateOrUpdateTravelIntentionRequest = {
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: title.trim(),
      tagline: tagline.trim(),
      iconName,
      featuredDestinations: destList,
      whatsappMessageTemplate: whatsappTemplate.trim(),
      coverMediaId,
      displayOrder: Number(displayOrder),
      active,
    };

    try {
      if (editingIntention) {
        await apiClient.updateTravelIntention(editingIntention.id, payload);
        setStatusMessage(`Intención "${title}" actualizada correctamente.`);
      } else {
        await apiClient.createTravelIntention(payload);
        setStatusMessage(`Intención "${title}" creada exitosamente.`);
      }
      setIsModalOpen(false);
      await refreshList();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar la intención de viaje.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar esta intención de viaje?")) return;
    try {
      await apiClient.deleteTravelIntention(id);
      setStatusMessage("Intención desactivada correctamente.");
      await refreshList();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al desactivar la intención.");
    }
  };

  return {
    intentions,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editingIntention,
    statusMessage,
    // Form fields
    slug, setSlug,
    title, setTitle,
    tagline, setTagline,
    iconName, setIconName,
    destinationsInput, setDestinationsInput,
    whatsappTemplate, setWhatsappTemplate,
    coverMediaId, coverMediaUrl,
    displayOrder, setDisplayOrder,
    active, setActive,
    isMediaPickerOpen, setIsMediaPickerOpen,
    // Handlers
    openCreateModal,
    openEditModal,
    handleSelectMedia,
    handleSave,
    handleDelete,
  };
}
