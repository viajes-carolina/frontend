"use client";

import React, { useState, useEffect } from "react";
import { MediaAssetDTO, apiClient } from "@vc/api-client";
import { Button } from "./Button";
import { FocalPointPicker } from "./FocalPointPicker";
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
  title = "Seleccionar y Editar Imagen",
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaAssetDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MediaAssetDTO | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentFocalX, setCurrentFocalX] = useState(50);
  const [currentFocalY, setCurrentFocalY] = useState(50);
  const [localPreviewSrc, setLocalPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setLocalPreviewSrc(null);
      apiClient
        .getMediaList(0, 50)
        .then((res) => {
          const list = res.items || [];
          setItems(list);
          if (selectedMediaId) {
            const found = list.find((m) => m.id === selectedMediaId);
            if (found) {
              setSelected(found);
              setCurrentFocalX(found.focalX || 50);
              setCurrentFocalY(found.focalY || 50);
              setShowGallery(false);
            } else {
              setShowGallery(true);
            }
          } else if (list.length > 0) {
            setSelected(list[0]);
            setCurrentFocalX(list[0].focalX || 50);
            setCurrentFocalY(list[0].focalY || 50);
            setShowGallery(false);
          } else {
            setShowGallery(true);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, selectedMediaId]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Crear vista previa inmediata con ObjectURL
    const localBlobUrl = URL.createObjectURL(file);
    setLocalPreviewSrc(localBlobUrl);

    setIsUploading(true);
    try {
      const uploaded = await apiClient.uploadMedia(file);
      const finalAsset: MediaAssetDTO = {
        ...uploaded,
        storagePath: uploaded.storagePath || localBlobUrl,
      };
      setItems((prev) => [finalAsset, ...prev]);
      setSelected(finalAsset);
      setCurrentFocalX(finalAsset.focalX || 50);
      setCurrentFocalY(finalAsset.focalY || 50);
      setShowGallery(false); // Directamente mostrar el editor de la nueva imagen
    } catch (err) {
      console.error("Error al subir imagen:", err);
      const fallbackAsset: MediaAssetDTO = {
        id: Date.now(),
        filename: file.name,
        originalName: file.name,
        mimeType: file.type || "image/webp",
        fileSizeBytes: file.size,
        width: 1920,
        height: 1080,
        focalX: 50,
        focalY: 50,
        altText: file.name.replace(/\.[^/.]+$/, ""),
        caption: "",
        storagePath: localBlobUrl,
        variantsJson: "{}",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItems((prev) => [fallbackAsset, ...prev]);
      setSelected(fallbackAsset);
      setCurrentFocalX(50);
      setCurrentFocalY(50);
      setShowGallery(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFromGallery = (item: MediaAssetDTO) => {
    setLocalPreviewSrc(null);
    setSelected(item);
    setCurrentFocalX(item.focalX || 50);
    setCurrentFocalY(item.focalY || 50);
    setShowGallery(false); // Al hacer clic en una imagen, entrar directamente a su edición
  };

  const handleConfirm = async () => {
    if (selected) {
      const updatedMedia: MediaAssetDTO = {
        ...selected,
        focalX: currentFocalX,
        focalY: currentFocalY,
      };

      // Si se modificó el punto focal, persistirlo en la API
      if (currentFocalX !== selected.focalX || currentFocalY !== selected.focalY) {
        try {
          await apiClient.updateMediaFocalPoint(selected.id, {
            focalX: currentFocalX,
            focalY: currentFocalY,
          });
        } catch (err) {
          console.error("Error al guardar punto focal:", err);
        }
      }

      onSelect(updatedMedia);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-border">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between bg-neutral-surface/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-navy/10 flex items-center justify-center text-brand-navy">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-sora font-bold text-base sm:text-lg text-brand-navy">{title}</h3>
              <p className="font-inter text-xs text-neutral-muted">
                {showGallery
                  ? "Selecciona una imagen de la biblioteca o sube una nueva"
                  : "Ajusta el punto focal interactivo para un encuadre perfecto en cualquier pantalla"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-surface text-neutral-muted transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Modal Toolbar */}
        <div className="px-6 py-3 bg-neutral-surface/40 border-b border-neutral-border flex items-center justify-between gap-4">
          <div>
            {!showGallery && (
              <button
                type="button"
                onClick={() => setShowGallery(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-border text-xs font-semibold text-brand-navy hover:bg-white transition-all shadow-sm"
              >
                🗂️ Ver Otras Imágenes
              </button>
            )}
            {showGallery && selected && (
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-navy/10 border border-brand-navy/20 text-xs font-semibold text-brand-navy hover:bg-brand-navy/20 transition-all"
              >
                ← Volver a Edición de Imagen
              </button>
            )}
          </div>

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

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto min-h-[340px]">
          {loading ? (
            <div className="flex items-center justify-center h-56 text-neutral-muted font-inter text-sm">
              Cargando biblioteca de imágenes...
            </div>
          ) : !showGallery && selected ? (
            /* Vista de Edición Directa de Imagen (Punto Focal) */
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-border">
                <div className="truncate">
                  <span className="font-sora font-bold text-sm text-brand-navy block truncate">
                    {selected.originalName || selected.filename}
                  </span>
                  <span className="font-inter text-xs text-neutral-muted">
                    {selected.width}×{selected.height} px • Formato WebP/JPG
                  </span>
                </div>
                <span className="text-xs font-bold font-inter text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                  Seleccionada por Defecto
                </span>
              </div>

              {/* Interactive Focal Point Picker */}
              <FocalPointPicker
                src={localPreviewSrc || selected.storagePath}
                alt={selected.altText || selected.originalName}
                initialFocalX={currentFocalX}
                initialFocalY={currentFocalY}
                onChange={(x, y) => {
                  setCurrentFocalX(x);
                  setCurrentFocalY(y);
                }}
              />
            </div>
          ) : (
            /* Vista Galería (Cuando el usuario desea elegir otra) */
            <div>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-neutral-muted font-inter text-sm gap-2">
                  <ImageIcon size={32} />
                  <span>No hay imágenes disponibles. Sube tu primera imagen.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items
                    .filter((item) => !!item.storagePath)
                    .map((item) => {
                      const isCurrent = selected?.id === item.id;
                      const safeUrl =
                        item.storagePath.startsWith("http") || item.storagePath.startsWith("/")
                          ? item.storagePath
                          : `/${item.storagePath}`;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectFromGallery(item)}
                          className={`group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all text-left ${
                            isCurrent
                              ? "border-brand-navy ring-4 ring-brand-navy/20 scale-[0.98]"
                              : "border-neutral-border hover:border-brand-accent/50 hover:shadow-md"
                          }`}
                        >
                          <img
                            src={safeUrl}
                            alt={item.altText || item.originalName}
                            loading="lazy"
                            style={{
                              objectFit: "cover",
                              objectPosition: `${item.focalX || 50}% ${item.focalY || 50}%`,
                              width: "100%",
                              height: "100%",
                            }}
                            className="transition-transform group-hover:scale-105 duration-300"
                          />

                          {isCurrent && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-navy text-white flex items-center justify-center shadow-md">
                              <CheckIcon size={14} />
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <p className="font-inter text-[11px] font-medium truncate">
                              {item.originalName}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-border flex items-center justify-between bg-neutral-surface/30">
          <div className="text-xs font-inter text-neutral-muted truncate max-w-xs">
            {selected ? (
              <span>
                Imagen activa: <strong className="text-brand-navy">{selected.originalName}</strong>
              </span>
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
              ✅ Confirmar y Usar Imagen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
