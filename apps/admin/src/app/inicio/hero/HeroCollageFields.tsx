"use client";

import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";
import type { HeroEditorState } from "../../../hooks/useHeroEditor";

export interface HeroCollageFieldsProps {
  editor: HeroEditorState;
}

/**
 * Las cuatro fotos del collage del Hero, en la rejilla 2×2 de la revisión de
 * Figma (958:459, punto 1): "Foto principal" + "Apoyo superior" arriba,
 * "Apoyo lateral" + "Apoyo inferior" abajo.
 *
 * Los nombres son los del diseño y coinciden con los `placement` del collage
 * público (`main`, `top`, `side`, `bottom`), así que la ficha del panel y la
 * posición en la portada se leen igual.
 *
 * En una sola columna (móvil y tablet) las cuatro fichas se apilan: a menos de
 * 360px de ancho útil el par no cabe sin recortar los metadatos.
 */
export function HeroCollageFields({ editor }: HeroCollageFieldsProps) {
  const { hero, assets } = editor;

  return (
    <div className="grid grid-cols-1 items-start gap-x-4 gap-y-3.5 sm:grid-cols-2">
      <HeroPhotoSlot
        variant="row"
        label="Foto principal"
        mediaId={hero.backgroundMediaId}
        mediaUrl={hero.backgroundMediaUrl}
        focalX={hero.backgroundFocalX}
        focalY={hero.backgroundFocalY}
        asset={hero.backgroundMediaId ? assets.get(hero.backgroundMediaId) : undefined}
        onSelect={editor.selectMain}
        modalTitle="Seleccionar la foto principal del Hero"
      />

      <HeroPhotoSlot
        variant="row"
        label="Apoyo superior"
        mediaId={hero.secondaryMedia1Id}
        mediaUrl={hero.secondaryMedia1Url}
        focalX={hero.secondaryMedia1FocalX}
        focalY={hero.secondaryMedia1FocalY}
        asset={hero.secondaryMedia1Id ? assets.get(hero.secondaryMedia1Id) : undefined}
        onSelect={editor.selectSupport1}
        modalTitle="Seleccionar la foto de apoyo superior"
      />

      <HeroPhotoSlot
        variant="row"
        label="Apoyo lateral"
        // El collage público la monta con `hidden xl:block`: por debajo de
        // 1280px esta foto no llega a dibujarse. Decirlo evita que alguien
        // pierda el tiempo buscándola en un móvil.
        helperText="Solo aparece en escritorio ancho, desde 1280 px."
        mediaId={hero.secondaryMedia2Id}
        mediaUrl={hero.secondaryMedia2Url}
        focalX={hero.secondaryMedia2FocalX}
        focalY={hero.secondaryMedia2FocalY}
        asset={hero.secondaryMedia2Id ? assets.get(hero.secondaryMedia2Id) : undefined}
        onSelect={editor.selectSupport2}
        modalTitle="Seleccionar la foto de apoyo lateral"
      />

      <HeroPhotoSlot
        variant="row"
        label="Apoyo inferior"
        mediaId={hero.secondaryMedia3Id}
        mediaUrl={hero.secondaryMedia3Url}
        focalX={hero.secondaryMedia3FocalX}
        focalY={hero.secondaryMedia3FocalY}
        asset={hero.secondaryMedia3Id ? assets.get(hero.secondaryMedia3Id) : undefined}
        onSelect={editor.selectSupport3}
        modalTitle="Seleccionar la foto de apoyo inferior"
      />
    </div>
  );
}
