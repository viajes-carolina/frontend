"use client";

import React from "react";
import Image from "next/image";
import { Button, CloseIcon, ImageIcon, MediaPickerModal } from "@vc/ui";
import { MediaAssetDTO, PromotionGalleryItemDTO } from "@vc/api-client";
import { PromotionGalleryGrid } from "./PromotionGalleryGrid";

export interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  source?: string;
  facebookPermalinkUrl?: string;
  createdAt?: string;
  slug: string;
  setSlug: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  priceUsd: number | string;
  setPriceUsd: (val: number | string) => void;
  pricePen: number | string;
  setPricePen: (val: number | string) => void;
  durationDays: number;
  setDurationDays: (val: number) => void;
  durationNights: number;
  setDurationNights: (val: number) => void;
  departureCity: string;
  setDepartureCity: (val: string) => void;
  validFrom: string;
  setValidFrom: (val: string) => void;
  validUntil: string;
  setValidUntil: (val: string) => void;
  featuredMediaId?: number;
  featuredMediaUrl?: string;
  gallery: PromotionGalleryItemDTO[];
  onAddToGallery: (media: MediaAssetDTO) => void;
  onRemoveFromGallery: (mediaId: number) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  inclusionsInput: string;
  setInclusionsInput: (val: string) => void;
  exclusionsInput: string;
  setExclusionsInput: (val: string) => void;
  whatsappTemplate: string;
  setWhatsappTemplate: (val: string) => void;
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

export function PromotionFormModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  source,
  facebookPermalinkUrl,
  createdAt,
  slug,
  setSlug,
  title,
  setTitle,
  destination,
  setDestination,
  summary,
  setSummary,
  priceUsd,
  setPriceUsd,
  pricePen,
  setPricePen,
  durationDays,
  setDurationDays,
  durationNights,
  setDurationNights,
  departureCity,
  setDepartureCity,
  validFrom,
  setValidFrom,
  validUntil,
  setValidUntil,
  featuredMediaId,
  featuredMediaUrl,
  gallery,
  onAddToGallery,
  onRemoveFromGallery,
  isFeatured,
  setIsFeatured,
  inclusionsInput,
  setInclusionsInput,
  exclusionsInput,
  setExclusionsInput,
  whatsappTemplate,
  setWhatsappTemplate,
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
}: PromotionFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-border p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
          <div>
            <h2 className="font-sora font-bold text-xl text-brand-navy">
              {isEditing ? "Editar Paquete / Promoción" : "Nueva Promoción de Viaje"}
            </h2>
            <p className="font-inter text-xs text-neutral-muted mt-0.5">
              Define los precios, destinos, días, noches, inclusiones, fotografía de portada y galería.
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
          {source === "FACEBOOK" && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-inter flex items-center justify-between gap-3">
              <span>
                📘 Sincronizado desde Facebook{createdAt ? ` el ${new Date(createdAt).toLocaleDateString("es-PE")}` : ""}.
                Revisa precio, duración y destino antes de activarla.
              </span>
              {facebookPermalinkUrl && (
                <a
                  href={facebookPermalinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-semibold underline hover:no-underline"
                >
                  Ver publicación original ↗
                </a>
              )}
            </div>
          )}

          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Título del Paquete
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Cartagena: Donde el mar te espera"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Slug URL
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cartagena-donde-el-mar-te-espera"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
          </div>

          {/* Fotos — portada + galería adicional, arriba y prominente */}
          <div className="p-4 rounded-2xl bg-neutral-surface/60 border border-neutral-border space-y-5">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Foto de Portada
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-40 aspect-video rounded-xl bg-white border border-neutral-border overflow-hidden shrink-0 shadow-sm">
                  {featuredMediaUrl ? (
                    <Image
                      src={featuredMediaUrl.startsWith("http") || featuredMediaUrl.startsWith("/") ? featuredMediaUrl : `/${featuredMediaUrl}`}
                      alt="Portada"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-muted">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  🖼️ {featuredMediaId ? "Cambiar Imagen" : "Elegir de Galería"}
                </Button>
              </div>
            </div>

            <PromotionGalleryGrid gallery={gallery} onAdd={onAddToGallery} onRemove={onRemoveFromGallery} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Destino (Ciudad, País)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Cartagena de Indias, Colombia"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Ciudad de Salida
              </label>
              <input
                type="text"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="Lima"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-surface/60 border border-neutral-border">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Precio (USD $)
              </label>
              <input
                type="number"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="429"
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Precio Aprox. (PEN S/)
              </label>
              <input
                type="number"
                value={pricePen}
                onChange={(e) => setPricePen(e.target.value)}
                placeholder="1590"
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Días
              </label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Noches
              </label>
              <input
                type="number"
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                required
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Resumen Descriptivo
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Disfruta del encanto caribeño con playas de arena cálida..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              required
            />
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Inclusiones (una por línea)
              </label>
              <textarea
                rows={3}
                value={inclusionsInput}
                onChange={(e) => setInclusionsInput(e.target.value)}
                placeholder="Vuelos ida y vuelta&#10;Hotel 4 estrellas&#10;Desayunos buffet"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
                required
              />
            </div>

            <div>
              <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Exclusiones (una por línea)
              </label>
              <textarea
                rows={3}
                value={exclusionsInput}
                onChange={(e) => setExclusionsInput(e.target.value)}
                placeholder="Gastos no especificados&#10;Seguro médico opcional"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              />
            </div>
          </div>

          {/* WhatsApp Message Template */}
          <div>
            <label className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Mensaje Predefinido para WhatsApp
            </label>
            <input
              type="text"
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder="Hola Viajes Carolina, me interesa la promoción..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeaturedCheckbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
              />
              <label htmlFor="isFeaturedCheckbox" className="font-inter text-sm text-brand-navy font-medium cursor-pointer">
                Destacar en Portada (Home)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activePromoCheckbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent"
              />
              <label htmlFor="activePromoCheckbox" className="font-inter text-sm text-brand-navy font-medium cursor-pointer">
                Promoción activa y visible
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Promoción"}
            </Button>
          </div>
        </form>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={onSelectMedia}
          selectedMediaId={featuredMediaId}
          items={mediaPickerItems}
          loading={mediaPickerLoading}
          onUploadFile={onUploadMediaFile}
          onFocalPointSave={onMediaFocalPointSave}
          title="Seleccionar Fotografía de la Promoción"
        />
      </div>
    </div>
  );
}
