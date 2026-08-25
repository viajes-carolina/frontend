"use client";

import { useMemo, useState } from "react";
import {
  apiClient,
  ApiError,
  CreateOrUpdatePromotionRequest,
  MediaAssetDTO,
  PromotionDTO,
} from "@vc/api-client";
import { estimatePricePenFromUsd } from "../lib/promotionPricing";

// El Home siempre debe tener exactamente 3 promociones activas para mostrar.
// El backend ya rechaza con 409 el intento de dejar el pool en menos de 3
// (ver PATCH /api/admin/v1/promotions/{id}/active); esta constante espeja esa
// misma regla en el cliente para dar feedback inmediato antes de llamar a la API.
const MIN_ACTIVE_PROMOTIONS = 3;

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError && err.body && typeof err.body === "object" && "message" in err.body) {
    const msg = String((err.body as { message: unknown }).message || "").trim();
    if (msg) return msg;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function defaultValidFrom(): string {
  return new Date().toISOString().split("T")[0];
}

function defaultValidUntil(): string {
  return new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0];
}

export function useAdminPromotionsCatalog(initialPromotions: PromotionDTO[]) {
  const [promotions, setPromotions] = useState<PromotionDTO[]>(initialPromotions);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Create modal — creación estructurada de promociones. El backend publica
  // automáticamente un post en la Página de Facebook con estos mismos campos
  // al crear; ya no existe sincronización de lectura desde Facebook.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [departureCity, setDepartureCity] = useState("Lima");
  const [priceUsd, setPriceUsdRaw] = useState<number | string>("");
  const [pricePen, setPricePen] = useState<number | string>("");
  const [durationDays, setDurationDays] = useState<number>(4);
  const [durationNights, setDurationNights] = useState<number>(3);
  const [validFrom, setValidFrom] = useState(defaultValidFrom());
  const [validUntil, setValidUntil] = useState(defaultValidUntil());
  const [summary, setSummary] = useState("");
  const [inclusionsInput, setInclusionsInput] = useState("");
  const [exclusionsInput, setExclusionsInput] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [featuredMediaId, setFeaturedMediaId] = useState<number | undefined>(undefined);
  const [featuredMediaUrl, setFeaturedMediaUrl] = useState<string | undefined>(undefined);
  const [featuredMediaFocalX, setFeaturedMediaFocalX] = useState<number | undefined>(undefined);
  const [featuredMediaFocalY, setFeaturedMediaFocalY] = useState<number | undefined>(undefined);

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

  const activeCount = useMemo(() => promotions.filter((p) => p.active).length, [promotions]);

  // Las 3 promociones activas más recientes por createdAt desc (id como
  // desempate) — cálculo puramente de presentación para el badge "En portada
  // ahora". La fuente de verdad real es el backend (GET .../promotions/featured).
  const topThreeIds = useMemo(() => {
    const sorted = [...promotions]
      .filter((p) => p.active)
      .sort((a, b) => {
        const diff = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        return diff !== 0 ? diff : b.id - a.id;
      })
      .slice(0, MIN_ACTIVE_PROMOTIONS);
    return new Set(sorted.map((p) => p.id));
  }, [promotions]);

  const canHide = (promo: PromotionDTO): boolean => !promo.active || activeCount > MIN_ACTIVE_PROMOTIONS;

  const handleToggleActive = async (promo: PromotionDTO): Promise<void> => {
    const willHide = promo.active === true;
    if (willHide && !canHide(promo)) {
      setStatusMessage(
        `No se puede ocultar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas. Activa otra antes de ocultar esta.`
      );
      return;
    }

    setStatusMessage(null);
    try {
      await apiClient.setPromotionActive(promo.id, !promo.active);
      setStatusMessage(
        willHide ? `"${promo.title}" ya no se muestra en Inicio.` : `"${promo.title}" ahora se muestra en Inicio.`
      );
      await refreshList();
    } catch (err) {
      console.error(err);
      // Carrera entre pestañas: el backend puede rechazar con 409 aunque el
      // cálculo local de canHide() lo permitiera — se muestra el mensaje real
      // del backend en vez de uno genérico (con un fallback específico si el
      // backend no trae mensaje, en vez de un genérico ciego).
      const fallback =
        err instanceof ApiError && err.status === 409
          ? `No se puede ocultar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas.`
          : `No se pudo actualizar el estado de "${promo.title}".`;
      setStatusMessage(extractErrorMessage(err, fallback));
      await refreshList();
    }
  };

  const handleDelete = async (promo: PromotionDTO): Promise<void> => {
    if (promo.active && !canHide(promo)) {
      setStatusMessage(
        `No se puede borrar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas. Ocúltala o activa otra antes de borrarla.`
      );
      return;
    }
    if (!confirm(`¿Borrar definitivamente "${promo.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setStatusMessage(null);
    try {
      await apiClient.deletePromotion(promo.id);
      setStatusMessage(`"${promo.title}" se borró definitivamente.`);
      await refreshList();
    } catch (err) {
      console.error(err);
      const fallback =
        err instanceof ApiError && err.status === 409
          ? `No se puede borrar "${promo.title}": el Home necesita al menos ${MIN_ACTIVE_PROMOTIONS} promociones activas.`
          : `No se pudo borrar "${promo.title}".`;
      setStatusMessage(extractErrorMessage(err, fallback));
      await refreshList();
    }
  };

  const resetCreateForm = () => {
    setTitle("");
    setDestination("");
    setDepartureCity("Lima");
    setPriceUsdRaw("");
    setPricePen("");
    setDurationDays(4);
    setDurationNights(3);
    setValidFrom(defaultValidFrom());
    setValidUntil(defaultValidUntil());
    setSummary("");
    setInclusionsInput("");
    setExclusionsInput("");
    setWhatsappTemplate("");
    setFeaturedMediaId(undefined);
    setFeaturedMediaUrl(undefined);
    setFeaturedMediaFocalX(undefined);
    setFeaturedMediaFocalY(undefined);
  };

  const openCreateModal = () => {
    resetCreateForm();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Al escribir el precio en USD, sugiere el precio en PEN si aún no fue editado a mano.
  const setPriceUsd = (value: number | string) => {
    setPriceUsdRaw(value);
    if (value && !pricePen) {
      setPricePen(estimatePricePenFromUsd(Number(value)));
    }
  };

  const handleSelectFeaturedMedia = (media: MediaAssetDTO) => {
    setFeaturedMediaId(media.id);
    setFeaturedMediaUrl(media.storagePath);
    setFeaturedMediaFocalX(media.focalX);
    setFeaturedMediaFocalY(media.focalY);
  };

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSaving(true);

    const inclusions = inclusionsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const exclusions = exclusionsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateOrUpdatePromotionRequest = {
      title: title.trim(),
      destination: destination.trim(),
      summary: summary.trim(),
      priceUsd: Number(priceUsd),
      pricePen: pricePen ? Number(pricePen) : undefined,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      departureCity: departureCity.trim() || undefined,
      validFrom: validFrom.trim() || undefined,
      validUntil: validUntil.trim() || undefined,
      featuredMediaId,
      inclusions,
      exclusions,
      whatsappMessageTemplate: whatsappTemplate.trim() || undefined,
    };

    try {
      const created = await apiClient.createPromotion(payload);
      setStatusMessage(
        created.facebookPermalinkUrl
          ? `Promoción "${created.title}" creada y publicada en Facebook.`
          : `Promoción "${created.title}" creada correctamente.`
      );
      setIsCreateModalOpen(false);
      await refreshList();
    } catch (err) {
      console.error(err);
      setStatusMessage(extractErrorMessage(err, "No se pudo crear la promoción."));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    promotions,
    isLoading,
    statusMessage,
    activeCount,
    topThreeIds,
    canHide,
    handleToggleActive,
    handleDelete,
    // Create modal
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    isSaving,
    title, setTitle,
    destination, setDestination,
    departureCity, setDepartureCity,
    priceUsd, setPriceUsd,
    pricePen, setPricePen,
    durationDays, setDurationDays,
    durationNights, setDurationNights,
    validFrom, setValidFrom,
    validUntil, setValidUntil,
    summary, setSummary,
    inclusionsInput, setInclusionsInput,
    exclusionsInput, setExclusionsInput,
    whatsappTemplate, setWhatsappTemplate,
    featuredMediaId, featuredMediaUrl, featuredMediaFocalX, featuredMediaFocalY,
    handleSelectFeaturedMedia,
    handleCreate,
  };
}
