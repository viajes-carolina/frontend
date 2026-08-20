"use client";

import { useState, useEffect } from "react";
import {
  PromotionDTO,
  CreateOrUpdatePromotionRequest,
  MediaAssetDTO,
  apiClient,
} from "@vc/api-client";
import { estimatePricePenFromUsd, slugify } from "../lib/promotionPricing";

export function useAdminPromotions(initialPromotions: PromotionDTO[]) {
  const [promotions, setPromotions] = useState<PromotionDTO[]>(initialPromotions);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState("");
  const [title, setTitleRaw] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [priceUsd, setPriceUsdRaw] = useState<number | string>("");
  const [pricePen, setPricePen] = useState<number | string>("");
  const [durationDays, setDurationDays] = useState<number>(4);
  const [durationNights, setDurationNights] = useState<number>(3);
  const [departureCity, setDepartureCity] = useState("Lima");
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0]
  );
  const [featuredMediaId, setFeaturedMediaId] = useState<number | undefined>(undefined);
  const [featuredMediaUrl, setFeaturedMediaUrl] = useState<string | undefined>(undefined);
  const [isFeatured, setIsFeatured] = useState(true);
  const [inclusionsInput, setInclusionsInput] = useState("");
  const [exclusionsInput, setExclusionsInput] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const refreshList = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getAdminPromotions();
      setPromotions(data);
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
    setEditingPromotion(null);
    setSlug("");
    setTitleRaw("");
    setDestination("");
    setSummary("");
    setPriceUsdRaw("");
    setPricePen("");
    setDurationDays(4);
    setDurationNights(3);
    setDepartureCity("Lima");
    setValidFrom(new Date().toISOString().split("T")[0]);
    setValidUntil(new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0]);
    setFeaturedMediaId(undefined);
    setFeaturedMediaUrl(undefined);
    setIsFeatured(true);
    setInclusionsInput("Vuelos ida y vuelta con equipaje, Hotel 4 estrellas con desayuno, Traslados aeropuerto - hotel");
    setExclusionsInput("Gastos personales, Tarjeta de asistencia médica");
    setWhatsappTemplate('Hola Viajes Carolina, me interesa consultar disponibilidad para esta promoción. ¿Me podrían asesorar?');
    setDisplayOrder(promotions.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (promo: PromotionDTO) => {
    setEditingPromotion(promo);
    setSlug(promo.slug);
    setTitleRaw(promo.title);
    setDestination(promo.destination);
    setSummary(promo.summary);
    setPriceUsdRaw(promo.priceUsd);
    setPricePen(promo.pricePen || "");
    setDurationDays(promo.durationDays);
    setDurationNights(promo.durationNights);
    setDepartureCity(promo.departureCity || "Lima");
    setValidFrom(promo.validFrom);
    setValidUntil(promo.validUntil);
    setFeaturedMediaId(promo.featuredMediaId);
    setFeaturedMediaUrl(promo.featuredMediaUrl);
    setIsFeatured(promo.isFeatured);
    setInclusionsInput((promo.inclusions || []).join("\n"));
    setExclusionsInput((promo.exclusions || []).join("\n"));
    setWhatsappTemplate(promo.whatsappMessageTemplate || "");
    setDisplayOrder(promo.displayOrder || 0);
    setActive(promo.active);
    setIsModalOpen(true);
  };

  // Al escribir el título, sugiere el slug si aún no fue editado a mano.
  const setTitle = (value: string) => {
    setTitleRaw(value);
    if (!editingPromotion && !slug) {
      setSlug(slugify(value));
    }
  };

  // Al escribir el precio en USD, sugiere el precio en PEN si aún no fue editado a mano.
  const setPriceUsd = (value: number | string) => {
    setPriceUsdRaw(value);
    if (value && !pricePen) {
      setPricePen(estimatePricePenFromUsd(Number(value)));
    }
  };

  const handleSelectMedia = (media: MediaAssetDTO) => {
    setFeaturedMediaId(media.id);
    setFeaturedMediaUrl(media.storagePath);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const incList = inclusionsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const excList = exclusionsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateOrUpdatePromotionRequest = {
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: title.trim(),
      destination: destination.trim(),
      summary: summary.trim(),
      priceUsd: Number(priceUsd),
      pricePen: pricePen ? Number(pricePen) : undefined,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      departureCity: departureCity.trim(),
      validFrom,
      validUntil,
      featuredMediaId,
      isFeatured,
      inclusions: incList,
      exclusions: excList,
      whatsappMessageTemplate: whatsappTemplate.trim(),
      displayOrder: Number(displayOrder),
      active,
    };

    try {
      if (editingPromotion) {
        await apiClient.updatePromotion(editingPromotion.id, payload);
        setStatusMessage(`Promoción "${title}" actualizada correctamente.`);
      } else {
        await apiClient.createPromotion(payload);
        setStatusMessage(`Promoción "${title}" creada exitosamente.`);
      }
      setIsModalOpen(false);
      await refreshList();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar la promoción.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar esta promoción?")) return;
    try {
      await apiClient.deletePromotion(id);
      setStatusMessage("Promoción desactivada correctamente.");
      await refreshList();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al desactivar la promoción.");
    }
  };

  return {
    promotions,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editingPromotion,
    statusMessage,
    // Form fields
    slug, setSlug,
    title, setTitle,
    destination, setDestination,
    summary, setSummary,
    priceUsd, setPriceUsd,
    pricePen, setPricePen,
    durationDays, setDurationDays,
    durationNights, setDurationNights,
    departureCity, setDepartureCity,
    validFrom, setValidFrom,
    validUntil, setValidUntil,
    featuredMediaId, featuredMediaUrl,
    isFeatured, setIsFeatured,
    inclusionsInput, setInclusionsInput,
    exclusionsInput, setExclusionsInput,
    whatsappTemplate, setWhatsappTemplate,
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
