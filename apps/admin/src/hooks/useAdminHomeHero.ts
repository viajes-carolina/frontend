"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { HomeHeroDTO, MediaAssetDTO, apiClient } from "@vc/api-client";

export function useAdminHomeHero(initialHero: HomeHeroDTO) {
  const [hero, setHero] = useState<HomeHeroDTO>(initialHero);
  const [badgeText, setBadgeText] = useState(initialHero.badgeText);
  const [titleHighlight, setTitleHighlight] = useState(initialHero.titleHighlight);
  const [titleAccent, setTitleAccent] = useState(initialHero.titleAccent);
  const [description, setDescription] = useState(initialHero.description);
  const [whatsappCtaText, setWhatsappCtaText] = useState(initialHero.whatsappCtaText);
  const [whatsappMessageOverride, setWhatsappMessageOverride] = useState(
    initialHero.whatsappMessageOverride || ""
  );
  const [secondaryCtaText, setSecondaryCtaText] = useState(
    initialHero.secondaryCtaText || ""
  );
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState(
    initialHero.secondaryCtaUrl || ""
  );
  const [trustIndicators, setTrustIndicators] = useState<string[]>(
    initialHero.trustIndicators || []
  );
  const [backgroundMediaId, setBackgroundMediaId] = useState<number | undefined>(
    initialHero.backgroundMediaId
  );
  const [backgroundMediaUrl, setBackgroundMediaUrl] = useState<string | undefined>(
    initialHero.backgroundMediaUrl
  );
  const [secondaryMedia1Id, setSecondaryMedia1Id] = useState<number | undefined>(
    initialHero.secondaryMedia1Id
  );
  const [secondaryMedia1Url, setSecondaryMedia1Url] = useState<string | undefined>(
    initialHero.secondaryMedia1Url
  );
  const [secondaryMedia1FocalX, setSecondaryMedia1FocalX] = useState<number>(
    initialHero.secondaryMedia1FocalX || 50
  );
  const [secondaryMedia1FocalY, setSecondaryMedia1FocalY] = useState<number>(
    initialHero.secondaryMedia1FocalY || 50
  );
  const [secondaryMedia2Id, setSecondaryMedia2Id] = useState<number | undefined>(
    initialHero.secondaryMedia2Id
  );
  const [secondaryMedia2Url, setSecondaryMedia2Url] = useState<string | undefined>(
    initialHero.secondaryMedia2Url
  );
  const [secondaryMedia2FocalX, setSecondaryMedia2FocalX] = useState<number>(
    initialHero.secondaryMedia2FocalX || 50
  );
  const [secondaryMedia2FocalY, setSecondaryMedia2FocalY] = useState<number>(
    initialHero.secondaryMedia2FocalY || 50
  );
  const [secondaryMedia3Id, setSecondaryMedia3Id] = useState<number | undefined>(
    initialHero.secondaryMedia3Id
  );
  const [secondaryMedia3Url, setSecondaryMedia3Url] = useState<string | undefined>(
    initialHero.secondaryMedia3Url
  );
  const [secondaryMedia3FocalX, setSecondaryMedia3FocalX] = useState<number>(
    initialHero.secondaryMedia3FocalX || 50
  );
  const [secondaryMedia3FocalY, setSecondaryMedia3FocalY] = useState<number>(
    initialHero.secondaryMedia3FocalY || 50
  );
  const [trustStatText, setTrustStatText] = useState(initialHero.trustStatText || "");
  const [eyebrowText, setEyebrowText] = useState(initialHero.eyebrowText || "");

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [backgroundFocalX, setBackgroundFocalX] = useState<number>(initialHero.backgroundFocalX || 50);
  const [backgroundFocalY, setBackgroundFocalY] = useState<number>(initialHero.backgroundFocalY || 50);

  // Último snapshot guardado/cargado (mismo shape que el `payload` de
  // handleSave), usado solo para comparación de "dirty" — no reemplaza los
  // ~26 useState individuales de arriba.
  const snapshotRef = useRef<Record<string, unknown> | null>(null);

  // Fresh rehydration on mount
  useEffect(() => {
    apiClient.getHomeHero().then((fresh) => {
      if (fresh) {
        setHero(fresh);
        setBadgeText(fresh.badgeText);
        setTitleHighlight(fresh.titleHighlight);
        setTitleAccent(fresh.titleAccent);
        setDescription(fresh.description);
        setWhatsappCtaText(fresh.whatsappCtaText);
        setWhatsappMessageOverride(fresh.whatsappMessageOverride || "");
        setSecondaryCtaText(fresh.secondaryCtaText || "");
        setSecondaryCtaUrl(fresh.secondaryCtaUrl || "");
        setTrustIndicators(fresh.trustIndicators || []);
        setBackgroundMediaId(fresh.backgroundMediaId);
        setBackgroundMediaUrl(fresh.backgroundMediaUrl);
        setBackgroundFocalX(fresh.backgroundFocalX || 50);
        setBackgroundFocalY(fresh.backgroundFocalY || 50);
        setSecondaryMedia1Id(fresh.secondaryMedia1Id);
        setSecondaryMedia1Url(fresh.secondaryMedia1Url);
        setSecondaryMedia1FocalX(fresh.secondaryMedia1FocalX || 50);
        setSecondaryMedia1FocalY(fresh.secondaryMedia1FocalY || 50);
        setSecondaryMedia2Id(fresh.secondaryMedia2Id);
        setSecondaryMedia2Url(fresh.secondaryMedia2Url);
        setSecondaryMedia2FocalX(fresh.secondaryMedia2FocalX || 50);
        setSecondaryMedia2FocalY(fresh.secondaryMedia2FocalY || 50);
        setSecondaryMedia3Id(fresh.secondaryMedia3Id);
        setSecondaryMedia3Url(fresh.secondaryMedia3Url);
        setSecondaryMedia3FocalX(fresh.secondaryMedia3FocalX || 50);
        setSecondaryMedia3FocalY(fresh.secondaryMedia3FocalY || 50);
        setTrustStatText(fresh.trustStatText || "");
        setEyebrowText(fresh.eyebrowText || "");

        snapshotRef.current = {
          badgeText: fresh.badgeText,
          titleHighlight: fresh.titleHighlight,
          titleAccent: fresh.titleAccent,
          description: fresh.description,
          whatsappCtaText: fresh.whatsappCtaText,
          whatsappMessageOverride: fresh.whatsappMessageOverride || "",
          secondaryCtaText: fresh.secondaryCtaText || "",
          secondaryCtaUrl: fresh.secondaryCtaUrl || "",
          trustIndicators: fresh.trustIndicators || [],
          backgroundMediaId: fresh.backgroundMediaId,
          backgroundMediaUrl: fresh.backgroundMediaUrl,
          backgroundFocalX: fresh.backgroundFocalX || 50,
          backgroundFocalY: fresh.backgroundFocalY || 50,
          secondaryMedia1Id: fresh.secondaryMedia1Id,
          secondaryMedia1Url: fresh.secondaryMedia1Url,
          secondaryMedia1FocalX: fresh.secondaryMedia1FocalX || 50,
          secondaryMedia1FocalY: fresh.secondaryMedia1FocalY || 50,
          secondaryMedia2Id: fresh.secondaryMedia2Id,
          secondaryMedia2Url: fresh.secondaryMedia2Url,
          secondaryMedia2FocalX: fresh.secondaryMedia2FocalX || 50,
          secondaryMedia2FocalY: fresh.secondaryMedia2FocalY || 50,
          secondaryMedia3Id: fresh.secondaryMedia3Id,
          secondaryMedia3Url: fresh.secondaryMedia3Url,
          secondaryMedia3FocalX: fresh.secondaryMedia3FocalX || 50,
          secondaryMedia3FocalY: fresh.secondaryMedia3FocalY || 50,
          trustStatText: fresh.trustStatText || "",
          eyebrowText: fresh.eyebrowText || "",
        };
      }
    });
  }, []);

  const handleSelectBgMedia = (media: MediaAssetDTO) => {
    setBackgroundMediaId(media.id);
    setBackgroundMediaUrl(media.storagePath);
    setBackgroundFocalX(media.focalX || 50);
    setBackgroundFocalY(media.focalY || 50);
  };

  const handleSelectSecondary1Media = (media: MediaAssetDTO) => {
    setSecondaryMedia1Id(media.id);
    setSecondaryMedia1Url(media.storagePath);
    setSecondaryMedia1FocalX(media.focalX || 50);
    setSecondaryMedia1FocalY(media.focalY || 50);
  };

  const handleSelectSecondary2Media = (media: MediaAssetDTO) => {
    setSecondaryMedia2Id(media.id);
    setSecondaryMedia2Url(media.storagePath);
    setSecondaryMedia2FocalX(media.focalX || 50);
    setSecondaryMedia2FocalY(media.focalY || 50);
  };

  const handleSelectSecondary3Media = (media: MediaAssetDTO) => {
    setSecondaryMedia3Id(media.id);
    setSecondaryMedia3Url(media.storagePath);
    setSecondaryMedia3FocalX(media.focalX || 50);
    setSecondaryMedia3FocalY(media.focalY || 50);
  };

  // Comparación directa del shape de estados actuales vs. el último snapshot
  // guardado/cargado — evita trackear "dirty" campo por campo mientras el
  // editor navega entre secciones.
  const isDirty = useMemo(() => {
    const current: Record<string, unknown> = {
      badgeText,
      titleHighlight,
      titleAccent,
      description,
      whatsappCtaText,
      whatsappMessageOverride,
      secondaryCtaText,
      secondaryCtaUrl,
      trustIndicators,
      backgroundMediaId,
      backgroundMediaUrl,
      backgroundFocalX,
      backgroundFocalY,
      secondaryMedia1Id,
      secondaryMedia1Url,
      secondaryMedia1FocalX,
      secondaryMedia1FocalY,
      secondaryMedia2Id,
      secondaryMedia2Url,
      secondaryMedia2FocalX,
      secondaryMedia2FocalY,
      secondaryMedia3Id,
      secondaryMedia3Url,
      secondaryMedia3FocalX,
      secondaryMedia3FocalY,
      trustStatText,
      eyebrowText,
    };
    return snapshotRef.current != null && JSON.stringify(current) !== JSON.stringify(snapshotRef.current);
  }, [
    badgeText,
    titleHighlight,
    titleAccent,
    description,
    whatsappCtaText,
    whatsappMessageOverride,
    secondaryCtaText,
    secondaryCtaUrl,
    trustIndicators,
    backgroundMediaId,
    backgroundMediaUrl,
    backgroundFocalX,
    backgroundFocalY,
    secondaryMedia1Id,
    secondaryMedia1Url,
    secondaryMedia1FocalX,
    secondaryMedia1FocalY,
    secondaryMedia2Id,
    secondaryMedia2Url,
    secondaryMedia2FocalX,
    secondaryMedia2FocalY,
    secondaryMedia3Id,
    secondaryMedia3Url,
    secondaryMedia3FocalX,
    secondaryMedia3FocalY,
    trustStatText,
    eyebrowText,
  ]);

  const discardChanges = useCallback(() => {
    const snap = snapshotRef.current;
    if (!snap) return;
    setBadgeText(snap.badgeText as string);
    setTitleHighlight(snap.titleHighlight as string);
    setTitleAccent(snap.titleAccent as string);
    setDescription(snap.description as string);
    setWhatsappCtaText(snap.whatsappCtaText as string);
    setWhatsappMessageOverride(snap.whatsappMessageOverride as string);
    setSecondaryCtaText(snap.secondaryCtaText as string);
    setSecondaryCtaUrl(snap.secondaryCtaUrl as string);
    setTrustIndicators(snap.trustIndicators as string[]);
    setBackgroundMediaId(snap.backgroundMediaId as number | undefined);
    setBackgroundMediaUrl(snap.backgroundMediaUrl as string | undefined);
    setBackgroundFocalX(snap.backgroundFocalX as number);
    setBackgroundFocalY(snap.backgroundFocalY as number);
    setSecondaryMedia1Id(snap.secondaryMedia1Id as number | undefined);
    setSecondaryMedia1Url(snap.secondaryMedia1Url as string | undefined);
    setSecondaryMedia1FocalX(snap.secondaryMedia1FocalX as number);
    setSecondaryMedia1FocalY(snap.secondaryMedia1FocalY as number);
    setSecondaryMedia2Id(snap.secondaryMedia2Id as number | undefined);
    setSecondaryMedia2Url(snap.secondaryMedia2Url as string | undefined);
    setSecondaryMedia2FocalX(snap.secondaryMedia2FocalX as number);
    setSecondaryMedia2FocalY(snap.secondaryMedia2FocalY as number);
    setSecondaryMedia3Id(snap.secondaryMedia3Id as number | undefined);
    setSecondaryMedia3Url(snap.secondaryMedia3Url as string | undefined);
    setSecondaryMedia3FocalX(snap.secondaryMedia3FocalX as number);
    setSecondaryMedia3FocalY(snap.secondaryMedia3FocalY as number);
    setTrustStatText(snap.trustStatText as string);
    setEyebrowText(snap.eyebrowText as string);
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload: Partial<HomeHeroDTO> = {
        badgeText,
        titleHighlight,
        titleAccent,
        description,
        whatsappCtaText,
        whatsappMessageOverride,
        secondaryCtaText,
        secondaryCtaUrl,
        trustIndicators,
        backgroundMediaId,
        backgroundMediaUrl,
        backgroundFocalX,
        backgroundFocalY,
        secondaryMedia1Id,
        secondaryMedia1Url,
        secondaryMedia1FocalX,
        secondaryMedia1FocalY,
        secondaryMedia2Id,
        secondaryMedia2Url,
        secondaryMedia2FocalX,
        secondaryMedia2FocalY,
        secondaryMedia3Id,
        secondaryMedia3Url,
        secondaryMedia3FocalX,
        secondaryMedia3FocalY,
        trustStatText,
        eyebrowText,
      };

      const updated = await apiClient.updateHomeHero(payload);
      setHero(updated);
      snapshotRef.current = { ...payload };
      setStatusMessage("Sección Hero actualizada y publicada exitosamente.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al guardar la sección Hero.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    hero,
    badgeText, setBadgeText,
    titleHighlight, setTitleHighlight,
    titleAccent, setTitleAccent,
    description, setDescription,
    whatsappCtaText, setWhatsappCtaText,
    whatsappMessageOverride, setWhatsappMessageOverride,
    secondaryCtaText, setSecondaryCtaText,
    secondaryCtaUrl, setSecondaryCtaUrl,
    trustIndicators, setTrustIndicators,
    backgroundMediaId, backgroundMediaUrl,
    backgroundFocalX, backgroundFocalY,
    secondaryMedia1Id, secondaryMedia1Url, secondaryMedia1FocalX, secondaryMedia1FocalY,
    secondaryMedia2Id, secondaryMedia2Url, secondaryMedia2FocalX, secondaryMedia2FocalY,
    secondaryMedia3Id, secondaryMedia3Url, secondaryMedia3FocalX, secondaryMedia3FocalY,
    trustStatText, setTrustStatText,
    eyebrowText, setEyebrowText,
    isSaving,
    statusMessage,
    isDirty,
    discardChanges,
    handleSelectBgMedia,
    handleSelectSecondary1Media,
    handleSelectSecondary2Media,
    handleSelectSecondary3Media,
    handleSave,
  };
}
