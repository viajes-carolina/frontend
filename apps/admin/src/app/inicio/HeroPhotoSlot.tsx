"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MediaAssetDTO } from "@vc/api-client";
import { Button, ImageIcon, MediaPickerModal } from "@vc/ui";
import { useMediaPicker } from "../../hooks/useMediaPicker";

export interface HeroPhotoSlotProps {
  label: string;
  helperText?: string;
  mediaId?: number;
  mediaUrl?: string;
  focalX?: number;
  focalY?: number;
  onSelect: (media: MediaAssetDTO) => void;
  modalTitle: string;
  variant?: "main" | "secondary";
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
}: HeroPhotoSlotProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const picker = useMediaPicker(isModalOpen);

  const imageSrc = mediaUrl
    ? (mediaUrl.startsWith("http") || mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`)
    : undefined;

  const isMain = variant === "main";

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
    </div>
  );
}
