"use client";

import { useState, useEffect } from "react";
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
  const [featuredCardBadge, setFeaturedCardBadge] = useState(
    initialHero.featuredCardBadge || ""
  );
  const [featuredCardTitle, setFeaturedCardTitle] = useState(
    initialHero.featuredCardTitle || ""
  );
  const [featuredCardSubtitle, setFeaturedCardSubtitle] = useState(
    initialHero.featuredCardSubtitle || ""
  );
  const [featuredCardPricePen, setFeaturedCardPricePen] = useState<number | undefined>(
    initialHero.featuredCardPricePen
  );
  const [featuredCardOrigin, setFeaturedCardOrigin] = useState(
    initialHero.featuredCardOrigin || ""
  );
  const [featuredCardMediaId, setFeaturedCardMediaId] = useState<number | undefined>(
    initialHero.featuredCardMediaId
  );
  const [featuredCardMediaUrl, setFeaturedCardMediaUrl] = useState<string | undefined>(
    initialHero.featuredCardMediaUrl
  );

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isCardMediaModalOpen, setIsCardMediaModalOpen] = useState(false);

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
        setFeaturedCardBadge(fresh.featuredCardBadge || "");
        setFeaturedCardTitle(fresh.featuredCardTitle || "");
        setFeaturedCardSubtitle(fresh.featuredCardSubtitle || "");
        setFeaturedCardPricePen(fresh.featuredCardPricePen);
        setFeaturedCardOrigin(fresh.featuredCardOrigin || "");
        setFeaturedCardMediaId(fresh.featuredCardMediaId);
        setFeaturedCardMediaUrl(fresh.featuredCardMediaUrl);
      }
    });
  }, []);

  const handleSelectBgMedia = (media: MediaAssetDTO) => {
    setBackgroundMediaId(media.id);
    setBackgroundMediaUrl(media.storagePath);
  };

  const handleSelectCardMedia = (media: MediaAssetDTO) => {
    setFeaturedCardMediaId(media.id);
    setFeaturedCardMediaUrl(media.storagePath);
  };

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
        featuredCardBadge,
        featuredCardTitle,
        featuredCardSubtitle,
        featuredCardPricePen,
        featuredCardOrigin,
        featuredCardMediaId,
      };

      const updated = await apiClient.updateHomeHero(payload);
      setHero(updated);
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
    featuredCardBadge, setFeaturedCardBadge,
    featuredCardTitle, setFeaturedCardTitle,
    featuredCardSubtitle, setFeaturedCardSubtitle,
    featuredCardPricePen, setFeaturedCardPricePen,
    featuredCardOrigin, setFeaturedCardOrigin,
    featuredCardMediaId, featuredCardMediaUrl,
    isSaving,
    statusMessage,
    isBgModalOpen, setIsBgModalOpen,
    isCardMediaModalOpen, setIsCardMediaModalOpen,
    handleSelectBgMedia,
    handleSelectCardMedia,
    handleSave,
  };
}
