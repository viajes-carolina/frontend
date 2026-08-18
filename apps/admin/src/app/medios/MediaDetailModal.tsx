"use client";

import React, { useState, useEffect } from "react";
import { MediaAssetDTO, UpdateMediaFocalPointRequest } from "@vc/api-client";
import { Button, CloseIcon, FocalPointPicker, TrashIcon } from "@vc/ui";

export interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaAssetDTO | null;
  onUpdateFocalPoint: (id: number, payload: UpdateMediaFocalPointRequest) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function MediaDetailModal({
  isOpen,
  onClose,
  media,
  onUpdateFocalPoint,
  onDelete,
}: MediaDetailModalProps) {
  const [focalX, setFocalX] = useState<number>(50);
  const [focalY, setFocalY] = useState<number>(50);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (media) {
      setFocalX(media.focalX || 50);
      setFocalY(media.focalY || 50);
      setAltText(media.altText || "");
      setCaption(media.caption || "");
    }
  }, [media]);

  if (!isOpen || !media) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateFocalPoint(media.id, {
        focalX,
        focalY,
        altText,
        caption,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const formattedSize =
    media.fileSizeBytes > 1024 * 1024
      ? `${(media.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(media.fileSizeBytes / 1024).toFixed(1)} KB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-neutral-border flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between">
          <div>
            <h3 className="font-sora font-bold text-lg text-brand-navy truncate max-w-md">
              {media.originalName}
            </h3>
            <p className="font-inter text-xs text-neutral-muted">
              ID #{media.id} • Subido el {new Date(media.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-surface text-neutral-muted transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Focal Point Picker */}
          <div className="md:col-span-7 space-y-4">
            <FocalPointPicker
              src={media.storagePath}
              alt={media.altText || media.originalName}
              initialFocalX={focalX}
              initialFocalY={focalY}
              onChange={(x, y) => {
                setFocalX(x);
                setFocalY(y);
              }}
            />
          </div>

          {/* Right: Metadata & Form */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Technical Badges */}
              <div className="bg-neutral-surface/60 p-4 rounded-2xl border border-neutral-border space-y-2 font-inter text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-muted">Dimensiones:</span>
                  <span className="font-semibold text-brand-navy">{media.width} × {media.height} px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-muted">Peso del archivo:</span>
                  <span className="font-semibold text-brand-navy">{formattedSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-muted">Tipo MIME:</span>
                  <span className="font-semibold text-brand-navy">{media.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-muted">Ruta de Almacenamiento:</span>
                  <span className="font-mono text-[10px] text-neutral-muted truncate max-w-[150px]">{media.storagePath}</span>
                </div>
              </div>

              {/* Alt Text Input */}
              <div>
                <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                  Texto Alternativo (Alt)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>

              {/* Caption Input */}
              <div>
                <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
                  Pie de Foto / Leyenda
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>

            {/* Danger Zone: Delete */}
            <div className="pt-4 border-t border-neutral-border flex justify-between items-center">
              <button
                type="button"
                onClick={() => onDelete(media.id)}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-inter font-medium"
              >
                <TrashIcon size={16} />
                Eliminar de biblioteca
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-border flex justify-end gap-3 bg-neutral-surface/30">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
