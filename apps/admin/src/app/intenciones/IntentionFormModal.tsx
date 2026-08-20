"use client";

import React from "react";
import Image from "next/image";
import { Button, CloseIcon, ImageIcon, MediaPickerModal } from "@vc/ui";
import { MediaAssetDTO } from "@vc/api-client";

export interface IntentionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  slug: string;
  setSlug: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  tagline: string;
  setTagline: (val: string) => void;
  iconName: string;
  setIconName: (val: string) => void;
  destinationsInput: string;
  setDestinationsInput: (val: string) => void;
  whatsappTemplate: string;
  setWhatsappTemplate: (val: string) => void;
  coverMediaId?: number;
  coverMediaUrl?: string;
  displayOrder: number;
  setDisplayOrder: (val: number) => void;
  active: boolean;
  setActive: (val: boolean) => void;
  isMediaPickerOpen: boolean;
  setIsMediaPickerOpen: (val: boolean) => void;
  onSelectMedia: (media: MediaAssetDTO) => void;
  mediaPickerItems: MediaAssetDTO[];
  mediaPickerLoading: boolean;
  onUploadMediaFile: (file: File) => Promise<MediaAssetDTO>;
  onMediaFocalPointSave: (id: number, payload: { focalX: number; focalY: number }) => Promise<void>;
}

export function IntentionFormModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  slug,
  setSlug,
  title,
  setTitle,
  tagline,
  setTagline,
  iconName,
  setIconName,
  destinationsInput,
  setDestinationsInput,
  whatsappTemplate,
  setWhatsappTemplate,
  coverMediaId,
  coverMediaUrl,
  displayOrder,
  setDisplayOrder,
  active,
  setActive,
  isMediaPickerOpen,
  setIsMediaPickerOpen,
  onSelectMedia,
  mediaPickerItems,
  mediaPickerLoading,
  onUploadMediaFile,
  onMediaFocalPointSave,
}: IntentionFormModalProps) {
  if (!isOpen) return null;

  const destinationsPreview = destinationsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-border p-6 sm:p-8 space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
          <div>
            <h2 className="font-sora font-bold text-xl text-brand-navy">
              {isEditing ? "Editar Intención de Viaje" : "Nueva Intención de Viaje"}
            </h2>
            <p className="font-inter text-xs text-neutral-muted mt-0.5">
              Personaliza la categoría, destinos sugeridos y mensaje de contacto.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-muted hover:text-brand-navy hover:bg-neutral-surface transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Título de la Intención
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isEditing && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                placeholder="Ej: Playa & Relax Caribe"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Slug Identificador
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="playa-relax"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Tagline / Subtítulo Inspirador
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Desconéctate frente al mar turquesa con resorts todo incluido..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>

          {/* Icon and Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Icono Visual
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
              >
                <option value="SunIcon">☀️ Sol / Playa (SunIcon)</option>
                <option value="LandmarkIcon">🏛️ Cultura / Monumentos (LandmarkIcon)</option>
                <option value="HeartIcon">❤️ Romance / Luna de Miel (HeartIcon)</option>
                <option value="CompassIcon">🧭 Aventura / Naturaleza (CompassIcon)</option>
              </select>
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Orden de Despliegue
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
          </div>

          {/* Destinations Input */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Destinos Sugeridos (separados por coma)
            </label>
            <input
              type="text"
              value={destinationsInput}
              onChange={(e) => setDestinationsInput(e.target.value)}
              placeholder="Cartagena, Cancún, Punta Cana, San Andrés"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
            {destinationsPreview.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {destinationsPreview.map((d, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-neutral-surface border border-neutral-border text-brand-navy font-inter text-xs"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Template */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Mensaje Predefinido para WhatsApp
            </label>
            <textarea
              rows={2}
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder="Hola Viajes Carolina, me interesa cotizar..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              required
            />
          </div>

          {/* Cover Media Picker */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Imagen de Portada (Biblioteca de Medios)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 aspect-video rounded-xl bg-neutral-surface border border-neutral-border overflow-hidden shrink-0">
                {coverMediaUrl ? (
                  <Image
                    src={coverMediaUrl.startsWith("http") || coverMediaUrl.startsWith("/") ? coverMediaUrl : `/${coverMediaUrl}`}
                    alt="Portada"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
              >
                🖼️ {coverMediaId ? "Cambiar Imagen" : "Elegir de Galería"}
              </Button>
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="activeCheckbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="activeCheckbox" className="font-inter text-sm text-brand-navy font-medium cursor-pointer">
              Intención visible en la portada web
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Intención"}
            </Button>
          </div>
        </form>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={onSelectMedia}
          selectedMediaId={coverMediaId}
          items={mediaPickerItems}
          loading={mediaPickerLoading}
          onUploadFile={onUploadMediaFile}
          onFocalPointSave={onMediaFocalPointSave}
          title="Seleccionar Portada de la Intención"
        />
      </div>
    </div>
  );
}
