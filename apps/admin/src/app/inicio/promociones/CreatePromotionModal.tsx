"use client";

import React from "react";
import { Button, FormField, Modal } from "@vc/ui";
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
    <Modal
      title="Nueva Promoción de Viaje"
      description="Al crearla se publica automáticamente un post en la Página de Facebook con estos datos."
      onClose={onClose}
      maxWidth="3xl"
      closeLabel="Cerrar formulario de nueva promoción"
    >
      {/* Form Body */}
      <form onSubmit={onSubmit} className="space-y-5">
          {/* Section: Contenido */}
          <p className="text-xs font-bold text-brand-navy uppercase tracking-wider">Contenido</p>

          {/* Title */}
          <div>
            <FormField
              label="Título del Paquete"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cartagena: Donde el mar te espera"
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
              <FormField
                label="Destino (Ciudad, País)"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Cartagena de Indias, Colombia"
                required
              />
            </div>

            <div>
              <FormField
                label="Ciudad de Salida"
                type="text"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="Lima"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <FormField
              label="Resumen Descriptivo"
              multiline
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Disfruta del encanto caribeño con playas de arena cálida..."
              required
            />
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Inclusiones (una por línea)"
                multiline
                rows={4}
                value={inclusionsInput}
                onChange={(e) => setInclusionsInput(e.target.value)}
                placeholder={"✈️ Ticket aéreo Lima - Buenos Aires - Lima\n🏨 Hotel 4 estrellas con desayuno\n🚐 Traslados aeropuerto - hotel"}
              />
            </div>

            <div>
              <FormField
                label="Exclusiones (una por línea)"
                multiline
                rows={4}
                value={exclusionsInput}
                onChange={(e) => setExclusionsInput(e.target.value)}
                placeholder={"❌ Gastos no especificados\n❌ Tarjeta de asistencia médica opcional"}
              />
            </div>
          </div>

          {/* Section: Precio & Fechas */}
          <p className="text-xs font-bold text-brand-navy uppercase tracking-wider pt-2 border-t border-neutral-border">
            Precio & Fechas
          </p>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-surface/60 border border-neutral-border">
            <div>
              <FormField
                label="Precio (USD $)"
                type="number"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="429"
                min={0}
                className="bg-white"
                required
              />
            </div>

            <div>
              <FormField
                label="Precio Aprox. (PEN S/)"
                type="number"
                value={pricePen}
                onChange={(e) => setPricePen(e.target.value)}
                placeholder="1590"
                min={0}
                className="bg-white"
              />
            </div>

            <div>
              <FormField
                label="Días"
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min={1}
                className="bg-white"
                required
              />
            </div>

            <div>
              <FormField
                label="Noches"
                type="number"
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                min={0}
                className="bg-white"
                required
              />
            </div>
          </div>

          {/* Vigencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Vigencia Desde (opcional)"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
              />
            </div>

            <div>
              <FormField
                label="Vigencia Hasta (opcional)"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          {/* Section: Mensaje de WhatsApp */}
          <p className="text-xs font-bold text-brand-navy uppercase tracking-wider pt-2 border-t border-neutral-border">
            Mensaje de WhatsApp
          </p>

          {/* WhatsApp Message Template */}
          <div>
            <FormField
              label="Plantilla de Mensaje de WhatsApp (opcional)"
              type="text"
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder="Hola Viajes Carolina, me interesa la promoción..."
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
    </Modal>
  );
}
