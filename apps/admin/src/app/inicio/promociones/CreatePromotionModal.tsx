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

const SECTION_TITLE_CLASSES =
  "font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label";

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
      <form onSubmit={onSubmit}>
        <div className="space-y-5">
          <h3 className={SECTION_TITLE_CLASSES}>Contenido</h3>

          <FormField
            label="Título del Paquete"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Cartagena: Donde el mar te espera"
            required
            hint={title.trim() ? `Vista previa de URL: /${slugify(title)} (el slug final lo genera el sistema)` : undefined}
          />

          <div className="rounded-[10px] border border-admin-divider bg-admin-field p-4">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Destino (Ciudad, País)"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Cartagena de Indias, Colombia"
              required
            />
            <FormField
              label="Ciudad de Salida"
              type="text"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              placeholder="Lima"
            />
          </div>

          <FormField
            label="Resumen Descriptivo"
            multiline
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Disfruta del encanto caribeño con playas de arena cálida..."
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Inclusiones (una por línea)"
              multiline
              rows={4}
              value={inclusionsInput}
              onChange={(e) => setInclusionsInput(e.target.value)}
              placeholder={"Ticket aéreo Lima - Buenos Aires - Lima\nHotel 4 estrellas con desayuno\nTraslados aeropuerto - hotel"}
            />
            <FormField
              label="Exclusiones (una por línea)"
              multiline
              rows={4}
              value={exclusionsInput}
              onChange={(e) => setExclusionsInput(e.target.value)}
              placeholder={"Gastos no especificados\nTarjeta de asistencia médica opcional"}
            />
          </div>

          <div className="space-y-5 border-t border-admin-divider pt-5">
            <h3 className={SECTION_TITLE_CLASSES}>Precio &amp; Fechas</h3>

            <div className="grid grid-cols-2 gap-4 rounded-[10px] border border-admin-divider bg-admin-field p-4 sm:grid-cols-4">
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
              <FormField
                label="Precio Aprox. (PEN S/)"
                type="number"
                value={pricePen}
                onChange={(e) => setPricePen(e.target.value)}
                placeholder="1590"
                min={0}
                className="bg-white"
              />
              <FormField
                label="Días"
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min={1}
                className="bg-white"
                required
              />
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Vigencia Desde (opcional)"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
              />
              <FormField
                label="Vigencia Hasta (opcional)"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-5 border-t border-admin-divider pt-5">
            <h3 className={SECTION_TITLE_CLASSES}>Mensaje de WhatsApp</h3>

            <FormField
              label="Plantilla de Mensaje de WhatsApp (opcional)"
              type="text"
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder="Hola Viajes Carolina, me interesa la promoción..."
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? "Creando..." : "Crear Promoción"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
