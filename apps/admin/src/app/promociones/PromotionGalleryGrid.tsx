"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MediaAssetDTO, PromotionGalleryItemDTO } from "@vc/api-client";
import { CloseIcon, ImageIcon, MediaPickerModal } from "@vc/ui";
import { useMediaPicker } from "../../hooks/useMediaPicker";

export interface PromotionGalleryGridProps {
  gallery: PromotionGalleryItemDTO[];
  onAdd: (media: MediaAssetDTO) => void;
  onRemove: (mediaId: number) => void;
}

export function PromotionGalleryGrid({ gallery, onAdd, onRemove }: PromotionGalleryGridProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const picker = useMediaPicker(isPickerOpen);

  const handleSelect = (media: MediaAssetDTO) => {
    onAdd(media);
    setIsPickerOpen(false);
  };

  return (
    <div>
      <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
        Galería adicional (opcional)
      </label>
      <p className="font-inter text-[11px] text-neutral-muted mb-3">
        Fotos extra de esta promoción, más allá de la portada. Todavía no se muestran en el sitio público.
      </p>

      <div className="flex flex-wrap gap-3">
        {gallery.map((item) => (
          <div
            key={item.mediaId}
            className="relative w-24 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0 group"
          >
            <Image
              src={item.mediaUrl.startsWith("http") || item.mediaUrl.startsWith("/") ? item.mediaUrl : `/${item.mediaUrl}`}
              alt="Foto de galería"
              fill
              style={{
                objectFit: "cover",
                objectPosition: `${item.focalX || 50}% ${item.focalY || 50}%`,
              }}
            />
            <button
              type="button"
              onClick={() => onRemove(item.mediaId)}
              className="absolute top-1 right-1 p-1 rounded-full bg-brand-navy/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Quitar foto de la galería"
            >
              <CloseIcon size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="w-24 aspect-video rounded-xl border-2 border-dashed border-neutral-border text-neutral-muted hover:border-brand-accent hover:text-brand-accent transition-colors flex flex-col items-center justify-center gap-1 shrink-0"
        >
          <ImageIcon size={18} />
          <span className="font-inter text-[10px] font-semibold">Agregar</span>
        </button>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelect}
        title="Agregar foto a la galería"
        items={picker.items}
        loading={picker.loading}
        onUploadFile={picker.uploadFile}
        onFocalPointSave={picker.saveFocalPoint}
      />
    </div>
  );
}
