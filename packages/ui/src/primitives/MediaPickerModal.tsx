"use client";

import React, { useState, useEffect } from "react";
import { MediaAssetDTO, apiClient } from "@vc/api-client";
import { Button } from "./Button";
import { CheckIcon, CloseIcon, ImageIcon } from "../icons/icons";

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaAssetDTO) => void;
  selectedMediaId?: number;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedMediaId,
  title = "Seleccionar Imagen de la Biblioteca",
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaAssetDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MediaAssetDTO | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiClient
        .getMediaList(0, 50)
        .then((res) => {
          setItems(res.items || []);
          if (selectedMediaId) {
            const found = res.items.find((m) => m.id === selectedMediaId);
            if (found) setSelected(found);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, selectedMediaId]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await apiClient.uploadMedia(file);
      setItems((prev) => [uploaded, ...prev]);
      setSelected(uploaded);
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-border">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <ImageIcon size={20} />
            </div>
            <h3 className="font-sora font-bold text-lg text-brand-navy">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-surface text-neutral-muted transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Modal Toolbar */}
        <div className="px-6 py-3 bg-neutral-surface/60 border-b border-neutral-border flex items-center justify-between gap-4">
          <span className="font-inter text-xs text-neutral-muted">
            {items.length} activos disponibles
          </span>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-sora bg-brand-navy text-white hover:bg-brand-navy/90 transition-colors shadow-sm">
              {isUploading ? "Subiendo..." : "➕ Subir Nueva Imagen"}
            </span>
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-neutral-muted font-inter text-sm">
              Cargando biblioteca de imágenes...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-muted font-inter text-sm gap-2">
              <ImageIcon size={32} />
              <span>No hay imágenes disponibles. Sube tu primera imagen.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => {
                const isCurrent = selected?.id === item.id;
                const safeUrl = item.storagePath.startsWith("http") || item.storagePath.startsWith("/")
                  ? item.storagePath
                  : `/${item.storagePath}`;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all text-left ${
                      isCurrent
                        ? "border-brand-primary ring-4 ring-brand-primary/20 scale-[0.98]"
                        : "border-neutral-border hover:border-brand-accent/50 hover:shadow-md"
                    }`}
                  >
                    <img
                      src={safeUrl}
                      alt={item.altText || item.originalName}
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        objectPosition: `${item.focalX}% ${item.focalY}%`,
                        width: "100%",
                        height: "100%",
                      }}
                      className="transition-transform group-hover:scale-105 duration-300"
                    />

                    {isCurrent && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md">
                        <CheckIcon size={14} />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                      <p className="font-inter text-[11px] font-medium truncate">{item.originalName}</p>
                      <p className="font-inter text-[10px] text-white/70">
                        {item.width}×{item.height} px
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-border flex items-center justify-between bg-neutral-surface/30">
          <div className="text-xs font-inter text-neutral-muted truncate max-w-xs">
            {selected ? (
              <span>Seleccionado: <strong className="text-brand-navy">{selected.originalName}</strong></span>
            ) : (
              <span>Ninguna imagen seleccionada</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!selected}
              onClick={handleConfirm}
            >
              Confirmar Selección
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
