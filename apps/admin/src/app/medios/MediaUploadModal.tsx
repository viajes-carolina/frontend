"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button, CloseIcon, ImageIcon } from "@vc/ui";

export interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, altText?: string, caption?: string) => Promise<void>;
  isUploading: boolean;
}

export function MediaUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: MediaUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      if (!altText) setAltText(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await onUpload(file, altText, caption);
    setFile(null);
    setPreviewUrl(null);
    setAltText("");
    setCaption("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <ImageIcon size={20} />
            </div>
            <h3 className="font-sora font-bold text-lg text-brand-navy">Subir Nuevo Activo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-surface text-neutral-muted transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Dropzone / Preview */}
          {previewUrl ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-surface border border-neutral-border">
              <Image
                src={previewUrl}
                alt="Vista previa"
                fill
                style={{ objectFit: "contain" }}
              />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-3 right-3 px-3 py-1 bg-black/70 hover:bg-black/90 text-white rounded-lg text-xs font-inter font-medium"
              >
                Cambiar Imagen
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video w-full rounded-2xl border-2 border-dashed border-neutral-border hover:border-brand-primary/60 bg-neutral-surface/40 hover:bg-neutral-surface cursor-pointer transition-all p-6 text-center group">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform mb-3">
                <ImageIcon size={24} />
              </div>
              <span className="font-sora font-semibold text-sm text-brand-navy">
                Haz clic para seleccionar o arrastra una imagen aquí
              </span>
              <span className="font-inter text-xs text-neutral-muted mt-1">
                Formatos recomendados: WebP, PNG, JPG (Hasta 10 MB)
              </span>
              <input
                type="file"
                accept="image/webp,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          )}

          {/* Alt Text */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Texto Alternativo (Accesibilidad & SEO)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Ej: Vista del Valle Sagrado en Cusco"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-2">
              Pie de Foto / Descripción (Opcional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ej: Fotografía tomada en temporada alta"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={!file || isUploading}
            >
              {isUploading ? "Subiendo y Procesando..." : "Subir a la Biblioteca"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
