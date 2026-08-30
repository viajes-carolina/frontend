"use client";

import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";
import type { HeroEditorState } from "../../../hooks/useHeroEditor";

export interface HeroCollageFieldsProps {
  editor: HeroEditorState;
}

/**
 * Las cuatro ranuras de foto del Hero, en la fila compacta del diseño.
 *
 * El mockup dibuja una sola "imagen principal" con recortes por dispositivo;
 * el Hero real no tiene eso: tiene un collage de una foto grande y tres de
 * apoyo, y cada una guarda su propio punto focal. Se conservan las cuatro.
 */
export function HeroCollageFields({ editor }: HeroCollageFieldsProps) {
  const { hero, assets } = editor;

  return (
    <>
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
        label="Foto de apoyo 1 (arriba)"
        mediaId={hero.secondaryMedia1Id}
        mediaUrl={hero.secondaryMedia1Url}
        focalX={hero.secondaryMedia1FocalX}
        focalY={hero.secondaryMedia1FocalY}
        asset={hero.secondaryMedia1Id ? assets.get(hero.secondaryMedia1Id) : undefined}
        onSelect={editor.selectSupport1}
        modalTitle="Seleccionar la foto de apoyo 1"
      />

      <HeroPhotoSlot
        variant="row"
        label="Foto de apoyo 2 (lateral)"
        helperText="Solo visible en pantallas de escritorio."
        mediaId={hero.secondaryMedia2Id}
        mediaUrl={hero.secondaryMedia2Url}
        focalX={hero.secondaryMedia2FocalX}
        focalY={hero.secondaryMedia2FocalY}
        asset={hero.secondaryMedia2Id ? assets.get(hero.secondaryMedia2Id) : undefined}
        onSelect={editor.selectSupport2}
        modalTitle="Seleccionar la foto de apoyo 2"
      />

      <HeroPhotoSlot
        variant="row"
        label="Foto de apoyo 3 (abajo)"
        mediaId={hero.secondaryMedia3Id}
        mediaUrl={hero.secondaryMedia3Url}
        focalX={hero.secondaryMedia3FocalX}
        focalY={hero.secondaryMedia3FocalY}
        asset={hero.secondaryMedia3Id ? assets.get(hero.secondaryMedia3Id) : undefined}
        onSelect={editor.selectSupport3}
        modalTitle="Seleccionar la foto de apoyo 3"
      />
    </>
  );
}
