"use client";

import { useCallback, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { HomeHeroDTO, MediaAssetDTO } from "@vc/api-client";
import { useAdminHomeHero } from "./useAdminHomeHero";
import { useAdminPublishing } from "./useAdminPublishing";
import { useMediaMetadata } from "./useMediaMetadata";
import { buildLastSavedLabel } from "../lib/editorSaveState";
import type { PreviewDevice } from "../components/editor/EditorDeviceSwitch";

/**
 * Alcance ISR del Hero: "Portada & Hero" revalida exactamente las páginas donde
 * se ve este contenido. Es el mismo valor que ofrece el gestor de publicación
 * de `/publicacion`, de modo que ambos caminos disparan la misma operación.
 */
const PUBLISH_TARGET = "HOME";
const PUBLISH_REASON = "Publicación del Hero principal desde el editor de Inicio";

export interface UseHeroEditorOptions {
  initialHero: HomeHeroDTO;
  initialLastSavedLabel: string;
}

/**
 * Orquesta el editor del Hero principal: el estado de los campos
 * (`useAdminHomeHero`), la ficha de cada imagen (`useMediaMetadata`), el
 * dispositivo de la vista previa y las dos formas de guardar.
 *
 * "Guardar borrador" solo persiste el contenido; el sitio público sigue
 * sirviendo lo ya publicado hasta que alguien revalide. "Guardar y publicar"
 * encadena guardado + revalidación ISR, y aborta la publicación si el guardado
 * no llegó a completarse — publicar tras un fallo solo republicaría lo viejo
 * anunciando que se publicó lo nuevo.
 */
export function useHeroEditor({ initialHero, initialLastSavedLabel }: UseHeroEditorOptions) {
  const router = useRouter();
  const hero = useAdminHomeHero(initialHero);
  const media = useMediaMetadata();
  const { triggerPublish } = useAdminPublishing();

  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [lastSavedLabel, setLastSavedLabel] = useState(initialLastSavedLabel);
  const [isPublishing, setIsPublishing] = useState(false);

  const { handleSave, setFeedback, discardChanges } = hero;

  const registerSaved = useCallback((saved: HomeHeroDTO) => {
    setLastSavedLabel(buildLastSavedLabel(saved.updatedAt ?? new Date().toISOString(), new Date()));
  }, []);

  const saveDraft = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const saved = await handleSave();
      if (saved) registerSaved(saved);
    },
    [handleSave, registerSaved],
  );

  const saveAndPublish = useCallback(async () => {
    const saved = await handleSave();
    if (!saved) return;
    registerSaved(saved);

    setIsPublishing(true);
    try {
      await triggerPublish({ target: PUBLISH_TARGET, reason: PUBLISH_REASON });
      setFeedback({
        tone: "success",
        message: "Cambios guardados y publicados: la portada ya sirve el contenido nuevo.",
      });
      // Repinta el encabezado con el estado de publicación recién registrado.
      router.refresh();
    } catch (err) {
      console.error(err);
      setFeedback({
        tone: "error",
        message:
          "Los cambios quedaron guardados, pero la publicación falló. Vuelve a lanzarla desde Publicación.",
      });
    } finally {
      setIsPublishing(false);
    }
  }, [handleSave, registerSaved, triggerPublish, setFeedback, router]);

  const cancel = useCallback(() => {
    discardChanges();
    setFeedback(null);
  }, [discardChanges, setFeedback]);

  // Las imágenes elegidas en el selector llegan con su ficha completa: se
  // registra para que la fila pueda escribir dimensiones y peso sin releer la
  // biblioteca.
  const withRegister = useCallback(
    (apply: (asset: MediaAssetDTO) => void) => (asset: MediaAssetDTO) => {
      media.register(asset);
      apply(asset);
    },
    [media],
  );

  /** El Hero tal como quedaría en el sitio con lo que hay ahora en el formulario. */
  const previewHero: HomeHeroDTO = useMemo(
    () => ({
      ...hero.hero,
      badgeText: hero.badgeText,
      eyebrowText: hero.eyebrowText,
      titleHighlight: hero.titleHighlight,
      titleAccent: hero.titleAccent,
      description: hero.description,
      whatsappCtaText: hero.whatsappCtaText,
      whatsappMessageOverride: hero.whatsappMessageOverride,
      secondaryCtaText: hero.secondaryCtaText,
      secondaryCtaUrl: hero.secondaryCtaUrl,
      trustIndicators: hero.trustIndicators,
      trustStatText: hero.trustStatText,
      backgroundMediaId: hero.backgroundMediaId,
      backgroundMediaUrl: hero.backgroundMediaUrl,
      backgroundFocalX: hero.backgroundFocalX,
      backgroundFocalY: hero.backgroundFocalY,
      secondaryMedia1Id: hero.secondaryMedia1Id,
      secondaryMedia1Url: hero.secondaryMedia1Url,
      secondaryMedia1FocalX: hero.secondaryMedia1FocalX,
      secondaryMedia1FocalY: hero.secondaryMedia1FocalY,
      secondaryMedia2Id: hero.secondaryMedia2Id,
      secondaryMedia2Url: hero.secondaryMedia2Url,
      secondaryMedia2FocalX: hero.secondaryMedia2FocalX,
      secondaryMedia2FocalY: hero.secondaryMedia2FocalY,
      secondaryMedia3Id: hero.secondaryMedia3Id,
      secondaryMedia3Url: hero.secondaryMedia3Url,
      secondaryMedia3FocalX: hero.secondaryMedia3FocalX,
      secondaryMedia3FocalY: hero.secondaryMedia3FocalY,
    }),
    [hero],
  );

  return {
    hero,
    assets: media.assets,
    selectMain: withRegister(hero.handleSelectBgMedia),
    selectSupport1: withRegister(hero.handleSelectSecondary1Media),
    selectSupport2: withRegister(hero.handleSelectSecondary2Media),
    selectSupport3: withRegister(hero.handleSelectSecondary3Media),
    device,
    setDevice,
    previewHero,
    lastSavedLabel,
    isPublishing,
    saveDraft,
    saveAndPublish,
    cancel,
  };
}

export type HeroEditorState = ReturnType<typeof useHeroEditor>;
