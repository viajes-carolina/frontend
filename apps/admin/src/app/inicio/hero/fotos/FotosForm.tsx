"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { HomeHeroDTO } from "@vc/api-client";
import { Button, CheckIcon } from "@vc/ui";
import { useAdminHomeHero } from "../../../../hooks/useAdminHomeHero";
import { HeroPhotoSlot } from "../../../../components/HeroPhotoSlot";

export interface FotosFormProps {
  initialHero: HomeHeroDTO;
}

export function FotosForm({ initialHero }: FotosFormProps) {
  const router = useRouter();
  const {
    backgroundMediaId, backgroundMediaUrl,
    backgroundFocalX, backgroundFocalY,
    secondaryMedia1Id, secondaryMedia1Url, secondaryMedia1FocalX, secondaryMedia1FocalY,
    secondaryMedia2Id, secondaryMedia2Url, secondaryMedia2FocalX, secondaryMedia2FocalY,
    secondaryMedia3Id, secondaryMedia3Url, secondaryMedia3FocalX, secondaryMedia3FocalY,
    isSaving,
    statusMessage,
    handleSelectBgMedia,
    handleSelectSecondary1Media,
    handleSelectSecondary2Media,
    handleSelectSecondary3Media,
    handleSave,
  } = useAdminHomeHero(initialHero);

  const handleSaveAndRefresh = async () => {
    await handleSave();
    router.refresh();
  };

  return (
    <>
      {statusMessage && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6 max-w-4xl">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">4. Collage de fotos de clientes</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            1 foto principal + 3 fotos de apoyo, siempre de clientes reales viviendo su viaje — nunca fotos del
            equipo de la agencia. Sin foto, el Hero muestra un placeholder de color, no una imagen de archivo.
          </p>
        </div>

        <HeroPhotoSlot
          variant="main"
          label="Foto Principal (grande)"
          mediaId={backgroundMediaId}
          mediaUrl={backgroundMediaUrl}
          focalX={backgroundFocalX}
          focalY={backgroundFocalY}
          onSelect={handleSelectBgMedia}
          modalTitle="Seleccionar Foto Principal del Hero"
        />

        <div className="pt-2 border-t border-neutral-border grid grid-cols-1 sm:grid-cols-3 gap-4">
          <HeroPhotoSlot
            label="Foto de Apoyo 1 (arriba)"
            mediaId={secondaryMedia1Id}
            mediaUrl={secondaryMedia1Url}
            focalX={secondaryMedia1FocalX}
            focalY={secondaryMedia1FocalY}
            onSelect={handleSelectSecondary1Media}
            modalTitle="Seleccionar Foto de Apoyo 1"
          />
          <HeroPhotoSlot
            label="Foto de Apoyo 2 (lateral)"
            helperText="Solo visible en pantallas de escritorio."
            mediaId={secondaryMedia2Id}
            mediaUrl={secondaryMedia2Url}
            focalX={secondaryMedia2FocalX}
            focalY={secondaryMedia2FocalY}
            onSelect={handleSelectSecondary2Media}
            modalTitle="Seleccionar Foto de Apoyo 2"
          />
          <HeroPhotoSlot
            label="Foto de Apoyo 3 (abajo)"
            mediaId={secondaryMedia3Id}
            mediaUrl={secondaryMedia3Url}
            focalX={secondaryMedia3FocalX}
            focalY={secondaryMedia3FocalY}
            onSelect={handleSelectSecondary3Media}
            modalTitle="Seleccionar Foto de Apoyo 3"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={handleSaveAndRefresh} disabled={isSaving}>
            Guardar Collage de Fotos
          </Button>
        </div>
      </div>
    </>
  );
}
