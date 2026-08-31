"use client";

import React from "react";
import { Button, FormField, Modal, type FormFeedbackState } from "@vc/ui";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";
import { TemplateExchangeBar } from "../../../components/TemplateExchangeBar";
import { slugify } from "../../../lib/promotionPricing";
import {
  parsePromotionTemplate,
  promotionTemplateFilename,
  serializePromotionTemplate,
  type PromotionTemplateDraft,
} from "../../../lib/promotionTemplate";
import type { PromotionFormBinding, PromotionModalMode } from "../../../lib/promotionsCatalog";

/**
 * La misma caja crea y corrige una promoción.
 *
 * El backend expone `POST /promotions` y `PUT /promotions/{id}` con idéntico
 * payload, así que duplicar el formulario para editar solo duplicaría catorce
 * campos y su validación. Lo que cambia entre los dos modos es el rótulo, el
 * botón y dos avisos: al editar no se republica en Facebook y el slug — la
 * dirección pública ya compartida — no se regenera aunque cambie el título.
 */
export interface CreatePromotionModalProps {
  mode: PromotionModalMode;
  /** Slug actual, solo en edición: se enseña porque NO cambia al guardar. */
  currentSlug?: string;
  /** Aviso para las promociones que dejó el importador de Facebook retirado. */
  legacyImportNotice?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  /** Los catorce campos, sus setters y el resultado de validarlos. */
  form: PromotionFormBinding;
  /** Vuelca sobre el formulario lo que traía una plantilla .md. */
  onApplyTemplate: (draft: PromotionTemplateDraft) => void;
}

const SECTION_TITLE_CLASSES =
  "font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label";

const MODE_COPY: Record<PromotionModalMode, { title: string; description: string; submit: string; saving: string; close: string }> = {
  create: {
    title: "Nueva Promoción de Viaje",
    description:
      "Al crearla se publica automáticamente un post en la Página de Facebook con estos datos.",
    submit: "Crear Promoción",
    saving: "Creando…",
    close: "Cerrar formulario de nueva promoción",
  },
  edit: {
    title: "Editar promoción",
    description:
      "Se corrige el contenido publicado en el sitio. La visibilidad en portada no cambia aquí y no se vuelve a publicar en Facebook.",
    submit: "Guardar cambios",
    saving: "Guardando…",
    close: "Cerrar formulario de edición de la promoción",
  },
};

export function CreatePromotionModal({
  mode,
  currentSlug,
  legacyImportNotice,
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  form,
  onApplyTemplate,
}: CreatePromotionModalProps) {
  if (!isOpen) return null;

  const {
    errors,
    warnings,
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
  } = form;

  /* Leer el archivo es asunto de `promotionTemplate`; aplicarlo, del hook que
     tiene los setters. Aquí solo se enlazan los dos y se devuelve el informe
     que la franja va a enseñar. */
  const applyTemplateFile = (text: string): FormFeedbackState => {
    const { draft, feedback } = parsePromotionTemplate(text);
    onApplyTemplate(draft);
    return feedback;
  };

  const copy = MODE_COPY[mode];
  const slugHint =
    mode === "edit"
      ? currentSlug
        ? `La dirección pública /${currentSlug} no cambia al editar: ya está compartida en Facebook.`
        : "La dirección pública no cambia al editar."
      : title.trim()
        ? `Vista previa de URL: /${slugify(title)} (el slug final lo genera el sistema)`
        : undefined;

  return (
    <Modal
      title={copy.title}
      description={copy.description}
      onClose={onClose}
      maxWidth="5xl"
      closeLabel={copy.close}
    >
      <form onSubmit={onSubmit} noValidate>
        <TemplateExchangeBar
          className="mb-6"
          hint="¿Prefieres preparar la promoción fuera del panel? Descarga la plantilla, rellénala en tu editor y súbela aquí. La foto se elige abajo."
          buildFile={() => ({
            filename: promotionTemplateFilename(title),
            content: serializePromotionTemplate(form),
          })}
          applyFile={applyTemplateFile}
        />

        {legacyImportNotice && (
          <p className="mb-5 rounded-[8px] border border-info-border bg-info-surface px-4 py-3 font-inter text-[11px] leading-[1.6] text-admin-value">
            {legacyImportNotice}
          </p>
        )}

        {/*
          En pantallas anchas el formulario se reparte en dos columnas: a la
          izquierda lo que describe el viaje y a la derecha la foto y los datos
          comerciales. Por debajo de `xl` vuelve a una sola columna, porque a
          esa anchura partirlo dejaría los campos demasiado estrechos —
          especialmente las dos listas de inclusiones y exclusiones.
        */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:items-start">
          <div className="space-y-5">
            <h3 className={SECTION_TITLE_CLASSES}>Contenido</h3>

            <FormField
              label="Título del Paquete"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cartagena: Donde el mar te espera"
              required
              error={errors.title}
              hint={slugHint}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Destino (Ciudad, País)"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Cartagena de Indias, Colombia"
                required
                error={errors.destination}
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
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Disfruta del encanto caribeño con playas de arena cálida..."
              required
              error={errors.summary}
            />

            <FormField
              label="Inclusiones (una por línea)"
              multiline
              rows={8}
              value={inclusionsInput}
              onChange={(e) => setInclusionsInput(e.target.value)}
              placeholder={"Ticket aéreo Lima - Buenos Aires - Lima\nHotel 4 estrellas con desayuno\nTraslados aeropuerto - hotel"}
            />

            <FormField
              label="Exclusiones (una por línea)"
              multiline
              rows={6}
              value={exclusionsInput}
              onChange={(e) => setExclusionsInput(e.target.value)}
              placeholder={"Gastos no especificados\nTarjeta de asistencia médica opcional"}
            />
          </div>

          <div className="space-y-5 xl:border-l xl:border-admin-divider xl:pl-8">
            <h3 className={SECTION_TITLE_CLASSES}>Imagen</h3>

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

            <div className="space-y-5 border-t border-admin-divider pt-5">
              <h3 className={SECTION_TITLE_CLASSES}>Precio &amp; Fechas</h3>

              <div className="grid grid-cols-2 gap-4 rounded-[10px] border border-admin-divider bg-admin-field p-4">
                <FormField
                  label="Precio (USD $)"
                  type="number"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(e.target.value)}
                  placeholder="429"
                  min={0}
                  className="bg-white"
                  required
                  error={errors.priceUsd}
                  hint={warnings.priceUsd}
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
                  error={errors.durationDays}
                  hint={warnings.durationDays}
                />
                <FormField
                  label="Noches"
                  type="number"
                  value={durationNights}
                  onChange={(e) => setDurationNights(Number(e.target.value))}
                  min={0}
                  className="bg-white"
                  required
                  error={errors.durationNights}
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
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-admin-divider pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? copy.saving : copy.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
