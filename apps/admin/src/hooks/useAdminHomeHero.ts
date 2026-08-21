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
  const [secondaryMedia4Id, setSecondaryMedia4Id] = useState<number | undefined>(
    initialHero.secondaryMedia4Id
  );
  const [secondaryMedia4Url, setSecondaryMedia4Url] = useState<string | undefined>(
    initialHero.secondaryMedia4Url
  );
  const [secondaryMedia4FocalX, setSecondaryMedia4FocalX] = useState<number>(
    initialHero.secondaryMedia4FocalX || 50
  );
  const [secondaryMedia4FocalY, setSecondaryMedia4FocalY] = useState<number>(
    initialHero.secondaryMedia4FocalY || 50
  );
  const [trustStatText, setTrustStatText] = useState(initialHero.trustStatText || "");
  const [eyebrowText, setEyebrowText] = useState(initialHero.eyebrowText || "");

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isCardMediaModalOpen, setIsCardMediaModalOpen] = useState(false);
  const [isSecondary1ModalOpen, setIsSecondary1ModalOpen] = useState(false);
  const [isSecondary2ModalOpen, setIsSecondary2ModalOpen] = useState(false);
  const [isSecondary3ModalOpen, setIsSecondary3ModalOpen] = useState(false);
  const [isSecondary4ModalOpen, setIsSecondary4ModalOpen] = useState(false);

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
        setFeaturedCardBadge(fresh.featuredCardBadge || "");
        setFeaturedCardTitle(fresh.featuredCardTitle || "");
        setFeaturedCardSubtitle(fresh.featuredCardSubtitle || "");
        setFeaturedCardPricePen(fresh.featuredCardPricePen);
        setFeaturedCardOrigin(fresh.featuredCardOrigin || "");
        setFeaturedCardMediaId(fresh.featuredCardMediaId);
        setFeaturedCardMediaUrl(fresh.featuredCardMediaUrl);
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
        setSecondaryMedia4Id(fresh.secondaryMedia4Id);
        setSecondaryMedia4Url(fresh.secondaryMedia4Url);
        setSecondaryMedia4FocalX(fresh.secondaryMedia4FocalX || 50);
        setSecondaryMedia4FocalY(fresh.secondaryMedia4FocalY || 50);
        setTrustStatText(fresh.trustStatText || "");
        setEyebrowText(fresh.eyebrowText || "");
      }
    });
  }, []);

  const [backgroundFocalX, setBackgroundFocalX] = useState<number>(initialHero.backgroundFocalX || 50);
  const [backgroundFocalY, setBackgroundFocalY] = useState<number>(initialHero.backgroundFocalY || 50);

  const handleSelectBgMedia = (media: MediaAssetDTO) => {
    setBackgroundMediaId(media.id);
    setBackgroundMediaUrl(media.storagePath);
    setBackgroundFocalX(media.focalX || 50);
    setBackgroundFocalY(media.focalY || 50);
  };

  const handleSelectCardMedia = (media: MediaAssetDTO) => {
    setFeaturedCardMediaId(media.id);
    setFeaturedCardMediaUrl(media.storagePath);
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

  const handleSelectSecondary4Media = (media: MediaAssetDTO) => {
    setSecondaryMedia4Id(media.id);
    setSecondaryMedia4Url(media.storagePath);
    setSecondaryMedia4FocalX(media.focalX || 50);
    setSecondaryMedia4FocalY(media.focalY || 50);
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
        backgroundMediaUrl,
        backgroundFocalX,
        backgroundFocalY,
        featuredCardBadge,
        featuredCardTitle,
        featuredCardSubtitle,
        featuredCardPricePen,
        featuredCardOrigin,
        featuredCardMediaId,
        featuredCardMediaUrl,
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
        secondaryMedia4Id,
        secondaryMedia4Url,
        secondaryMedia4FocalX,
        secondaryMedia4FocalY,
        trustStatText,
        eyebrowText,
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
    backgroundFocalX, backgroundFocalY,
    featuredCardBadge, setFeaturedCardBadge,
    featuredCardTitle, setFeaturedCardTitle,
    featuredCardSubtitle, setFeaturedCardSubtitle,
    featuredCardPricePen, setFeaturedCardPricePen,
    featuredCardOrigin, setFeaturedCardOrigin,
    featuredCardMediaId, featuredCardMediaUrl,
    secondaryMedia1Id, secondaryMedia1Url, secondaryMedia1FocalX, secondaryMedia1FocalY,
    secondaryMedia2Id, secondaryMedia2Url, secondaryMedia2FocalX, secondaryMedia2FocalY,
    secondaryMedia3Id, secondaryMedia3Url, secondaryMedia3FocalX, secondaryMedia3FocalY,
    secondaryMedia4Id, secondaryMedia4Url, secondaryMedia4FocalX, secondaryMedia4FocalY,
    trustStatText, setTrustStatText,
    eyebrowText, setEyebrowText,
    isSaving,
    statusMessage,
    isBgModalOpen, setIsBgModalOpen,
    isCardMediaModalOpen, setIsCardMediaModalOpen,
    isSecondary1ModalOpen, setIsSecondary1ModalOpen,
    isSecondary2ModalOpen, setIsSecondary2ModalOpen,
    isSecondary3ModalOpen, setIsSecondary3ModalOpen,
    isSecondary4ModalOpen, setIsSecondary4ModalOpen,
    handleSelectBgMedia,
    handleSelectCardMedia,
    handleSelectSecondary1Media,
    handleSelectSecondary2Media,
    handleSelectSecondary3Media,
    handleSelectSecondary4Media,
    handleSave,
  };
}
