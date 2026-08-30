"use client";

import React, { useId, useState } from "react";
import Image from "next/image";
import { MediaAssetDTO } from "@vc/api-client";
import { Button, ImageIcon, MediaPickerModal } from "@vc/ui";
import { useMediaPicker } from "../hooks/useMediaPicker";
import { HeroPhotoRow } from "./HeroPhotoRow";
import { describeMedia } from "../lib/mediaSummary";

export interface HeroPhotoSlotProps {
  label: string;
  helperText?: string;
  mediaId?: number;
  mediaUrl?: string;
  focalX?: number;
  focalY?: number;
  onSelect: (media: MediaAssetDTO) => void;
  modalTitle: string;
  /**
   * `main`/`secondary` son las fichas históricas del panel (miniatura grande y
   * botón debajo). `row` es la fila compacta de los editores de contenido
   * (Figma 930:4) y necesita `asset` para poder escribir dimensiones y peso.
   */
  variant?: "main" | "secondary" | "row";
  /** Ficha completa de la imagen, solo para `variant="row"`. */
  asset?: MediaAssetDTO;
}

export function HeroPhotoSlot({
  label,
  helperText,
  mediaId,
  mediaUrl,
  focalX,
  focalY,
  onSelect,
  modalTitle,
  variant = "secondary",
  asset,
}: HeroPhotoSlotProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const picker = useMediaPicker(isModalOpen);
  const labelId = useId();

  const imageSrc = mediaUrl
    ? (mediaUrl.startsWith("http") || mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`)
    : undefined;

  const isMain = variant === "main";

  const modal = (
    <MediaPickerModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSelect={onSelect}
      selectedMediaId={mediaId}
      title={modalTitle}
      items={picker.items}
      loading={picker.loading}
      onUploadFile={picker.uploadFile}
      onFocalPointSave={picker.saveFocalPoint}
    />
  );

  if (variant === "row") {
    return (
      <div>
        <HeroPhotoRow
          labelId={labelId}
          label={label}
          summary={describeMedia({ asset, mediaId, mediaUrl, focalX, focalY })}
          imageSrc={imageSrc}
          focalX={focalX}
          focalY={focalY}
          onOpenPicker={() => setIsModalOpen(true)}
        />
        {helperText && (
          <p className="mt-1.5 font-inter text-[10px] text-neutral-muted">{helperText}</p>
        )}
        {modal}
      </div>
    );
  }

  return (
    <div>
      <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
        {label}
      </label>
      {helperText && (
        <p className="font-inter text-[11px] text-neutral-muted mb-2">{helperText}</p>
      )}
      <div className={isMain ? "flex flex-col sm:flex-row items-start gap-4" : "flex flex-col gap-3"}>
        <div
          className={`relative rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 shadow-sm ${
            isMain ? "w-full sm:w-56 aspect-4/3" : "w-full aspect-video"
          }`}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={label}
              fill
              unoptimized
              style={{
                objectFit: "cover",
                objectPosition: `${focalX || 50}% ${focalY || 50}%`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-muted">
              <ImageIcon size={isMain ? 32 : 24} />
            </div>
          )}
        </div>
        <div>
          <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(true)}>
            🖼️ {mediaId ? "Cambiar Foto" : "Seleccionar Foto"}
          </Button>
          {mediaId && (
            <span className="block font-inter text-xs text-neutral-muted mt-1">
              ID Activo: #{mediaId} • Punto Focal: ({focalX || 50}%, {focalY || 50}%)
            </span>
          )}
        </div>
      </div>

      {modal}
    </div>
  );
}
