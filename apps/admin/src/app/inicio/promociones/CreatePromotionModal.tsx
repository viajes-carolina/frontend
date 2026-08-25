"use client";

import React from "react";
import { Button, CloseIcon } from "@vc/ui";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";
import { slugify } from "../../../lib/promotionPricing";
import type { MediaAssetDTO } from "@vc/api-client";

export interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  title: string;
  setTitle: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  departureCity: string;
  setDepartureCity: (val: string) => void;
  priceUsd: number | string;
  setPriceUsd: (val: number | string) => void;
  pricePen: number | string;
  setPricePen: (val: number | string) => void;
  durationDays: number;
  setDurationDays: (val: number) => void;
  durationNights: number;
  setDurationNights: (val: number) => void;
  validFrom: string;
  setValidFrom: (val: string) => void;
  validUntil: string;
  setValidUntil: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  inclusionsInput: string;
  setInclusionsInput: (val: string) => void;
  exclusionsInput: string;
  setExclusionsInput: (val: string) => void;
  whatsappTemplate: string;
  setWhatsappTemplate: (val: string) => void;
  featuredMediaId?: number;
  featuredMediaUrl?: string;
  featuredMediaFocalX?: number;
  featuredMediaFocalY?: number;
  onSelectFeaturedMedia: (media: MediaAssetDTO) => void;
}

export function CreatePromotionModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  title,
  setTitle,
  destination,
  setDestination,
  departureCity,
  setDepartureCity,
  priceUsd,
  setPriceUsd,
  pricePen,
  setPricePen,
  durationDays,
  setDurationDays,
  durationNights,
  setDurationNights,
  validFrom,
  setValidFrom,
  validUntil,
  setValidUntil,
  summary,
  setSummary,
  inclusionsInput,
  setInclusionsInput,
  exclusionsInput,
  setExclusionsInput,
  whatsappTemplate,
  setWhatsappTemplate,
  featuredMediaId,
  featuredMediaUrl,
  featuredMediaFocalX,
  featuredMediaFocalY,
  onSelectFeaturedMedia,
}: CreatePromotionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-border p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
          <div>
            <h2 className="font-sora font-bold text-xl text-brand-navy">Nueva Promoción de Viaje</h2>
            <p className="font-inter text-xs text-neutral-muted mt-0.5">
              Al crearla se publica automáticamente un post en la Página de Facebook con estos datos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario de nueva promoción"
            className="p-2 rounded-xl text-neutral-muted hover:text-brand-navy hover:bg-neutral-surface transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="promoTitle" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Título del Paquete
            </label>
            <input
              id="promoTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cartagena: Donde el mar te espera"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
            {title.trim() && (
              <p className="font-inter text-[11px] text-neutral-muted mt-1">
                Vista previa de URL: /{slugify(title)} (el slug final lo genera el sistema)
              </p>
            )}
          </div>

          {/* Foto destacada */}
          <div className="p-4 rounded-2xl bg-neutral-surface/60 border border-neutral-border">
            <HeroPhotoSlot
              variant="secondary"
              label="Foto Destacada"
              mediaId={featuredMediaId}
              mediaUrl={featuredMediaUrl}
              focalX={featuredMediaFocalX}
              focalY={featuredMediaFocalY}
              onSelect={onSelectFeaturedMedia}
              modalTitle="Seleccionar Fotografía de la Promoción"
            />
          </div>

          {/* Destino / Ciudad de salida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="promoDestination" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Destino (Ciudad, País)
              </label>
              <input
                id="promoDestination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Cartagena de Indias, Colombia"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>

            <div>
              <label htmlFor="promoDepartureCity" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Ciudad de Salida
              </label>
              <input
                id="promoDepartureCity"
                type="text"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="Lima"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-surface/60 border border-neutral-border">
            <div>
              <label htmlFor="promoPriceUsd" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Precio (USD $)
              </label>
              <input
                id="promoPriceUsd"
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
              <label htmlFor="promoPricePen" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Precio Aprox. (PEN S/)
              </label>
              <input
                id="promoPricePen"
                type="number"
                value={pricePen}
                onChange={(e) => setPricePen(e.target.value)}
                placeholder="1590"
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
              />
            </div>

            <div>
              <label htmlFor="promoDurationDays" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Días
              </label>
              <input
                id="promoDurationDays"
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="promoDurationNights" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Noches
              </label>
              <input
                id="promoDurationNights"
                type="number"
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent bg-white"
                required
              />
            </div>
          </div>

          {/* Vigencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="promoValidFrom" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Vigencia Desde (opcional)
              </label>
              <input
                id="promoValidFrom"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label htmlFor="promoValidUntil" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Vigencia Hasta (opcional)
              </label>
              <input
                id="promoValidUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="promoSummary" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Resumen Descriptivo
            </label>
            <textarea
              id="promoSummary"
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
              <label htmlFor="promoInclusions" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Inclusiones (una por línea)
              </label>
              <textarea
                id="promoInclusions"
                rows={4}
                value={inclusionsInput}
                onChange={(e) => setInclusionsInput(e.target.value)}
                placeholder={"✈️ Ticket aéreo Lima - Buenos Aires - Lima\n🏨 Hotel 4 estrellas con desayuno\n🚐 Traslados aeropuerto - hotel"}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              />
            </div>

            <div>
              <label htmlFor="promoExclusions" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
                Exclusiones (una por línea)
              </label>
              <textarea
                id="promoExclusions"
                rows={4}
                value={exclusionsInput}
                onChange={(e) => setExclusionsInput(e.target.value)}
                placeholder={"❌ Gastos no especificados\n❌ Tarjeta de asistencia médica opcional"}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              />
            </div>
          </div>

          {/* WhatsApp Message Template */}
          <div>
            <label htmlFor="promoWhatsapp" className="block font-inter text-xs font-semibold uppercase tracking-wider text-neutral-muted mb-1.5">
              Plantilla de Mensaje de WhatsApp (opcional)
            </label>
            <input
              id="promoWhatsapp"
              type="text"
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder="Hola Viajes Carolina, me interesa la promoción..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-border text-brand-navy font-inter text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={isSaving}>
              {isSaving ? "Creando..." : "Crear Promoción"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
