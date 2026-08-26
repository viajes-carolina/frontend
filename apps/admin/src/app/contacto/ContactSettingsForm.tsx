"use client";

import React from "react";
import { UpdateContactPageRequest } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";

export interface ContactSettingsFormProps {
  formData: UpdateContactPageRequest;
  updateField: <K extends keyof UpdateContactPageRequest>(field: K, value: UpdateContactPageRequest[K]) => void;
  onSubmit: (e?: React.FormEvent) => void;
  saving: boolean;
  saveSuccess: boolean;
}

export function ContactSettingsForm({ formData, updateField, onSubmit, saving, saveSuccess }: ContactSettingsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            Configuración Editorial de Contacto
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Personaliza los textos del Hero y la sección de Oficina.
          </p>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={saving}
          icon={saveSuccess ? <CheckIcon size={16} /> : undefined}
        >
          {saving ? "Guardando..." : saveSuccess ? "¡Guardado!" : "Guardar Cambios"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-inter flex items-center gap-2">
          <CheckIcon size={16} className="text-emerald-600" />
          <span>Configuración de Contacto actualizada con éxito.</span>
        </div>
      )}

      {/* Seccion 1: Hero */}
      <div className="space-y-4">
        <h3 className="font-sora font-semibold text-xs text-brand-navy uppercase tracking-wider">
          1. Hero & Encabezado Principal
        </h3>

        <FormField
          label="Insignia / Eyebrow Badge"
          type="text"
          required
          value={formData.heroBadge}
          onChange={(e) => updateField("heroBadge", e.target.value)}
        />

        <FormField
          label="Título Principal (H1)"
          type="text"
          required
          value={formData.heroTitle}
          onChange={(e) => updateField("heroTitle", e.target.value)}
        />

        <FormField
          label="Subtítulo Descriptivo"
          multiline
          required
          rows={2}
          value={formData.heroSubtitle}
          onChange={(e) => updateField("heroSubtitle", e.target.value)}
        />

        <FormField
          label="Texto del botón CTA de WhatsApp"
          type="text"
          required
          value={formData.heroCtaText}
          onChange={(e) => updateField("heroCtaText", e.target.value)}
        />

        <FormField
          label="Nota debajo del CTA"
          type="text"
          required
          value={formData.heroNoteText}
          onChange={(e) => updateField("heroNoteText", e.target.value)}
        />

        <FormField
          label="Mensaje predefinido de WhatsApp (CTA principal)"
          multiline
          required
          rows={2}
          value={formData.heroCtaMessage}
          onChange={(e) => updateField("heroCtaMessage", e.target.value)}
        />

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter uppercase tracking-wide">
            Tarjeta &quot;Información de contacto&quot;
          </label>
          <p className="text-xs text-neutral-muted font-inter -mt-1">
            El correo, el horario y la dirección se muestran automáticamente desde Identidad &amp; WhatsApp y Oficina &amp; Horarios — aquí solo editas el título y las etiquetas.
          </p>

          <FormField
            label="Título de la tarjeta"
            type="text"
            required
            value={formData.heroInfoTitle}
            onChange={(e) => updateField("heroInfoTitle", e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Etiqueta &quot;WhatsApp&quot;"
              type="text"
              required
              value={formData.heroInfoWhatsappLabel}
              onChange={(e) => updateField("heroInfoWhatsappLabel", e.target.value)}
            />
            <FormField
              label="Valor de WhatsApp"
              type="text"
              required
              value={formData.heroInfoWhatsappValue}
              onChange={(e) => updateField("heroInfoWhatsappValue", e.target.value)}
              placeholder="Ej: Atención inmediata"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField
              label="Etiqueta &quot;Correo&quot;"
              type="text"
              required
              value={formData.heroInfoEmailLabel}
              onChange={(e) => updateField("heroInfoEmailLabel", e.target.value)}
            />
            <FormField
              label="Etiqueta &quot;Horario&quot;"
              type="text"
              required
              value={formData.heroInfoScheduleLabel}
              onChange={(e) => updateField("heroInfoScheduleLabel", e.target.value)}
            />
            <FormField
              label="Etiqueta &quot;Oficina&quot;"
              type="text"
              required
              value={formData.heroInfoOfficeLabel}
              onChange={(e) => updateField("heroInfoOfficeLabel", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Seccion 2: Oficina */}
      <div className="space-y-4 pt-4 border-t border-neutral-border">
        <h3 className="font-sora font-semibold text-xs text-brand-navy uppercase tracking-wider">
          2. Oficina & Mapa
        </h3>

        <FormField
          label="Insignia / Eyebrow Badge"
          type="text"
          required
          value={formData.officeSectionBadge}
          onChange={(e) => updateField("officeSectionBadge", e.target.value)}
        />

        <FormField
          label="Título de sección"
          type="text"
          required
          value={formData.officeSectionTitle}
          onChange={(e) => updateField("officeSectionTitle", e.target.value)}
        />

        <p className="text-xs text-neutral-muted font-inter">
          La dirección junto al título y el horario del panel se muestran automáticamente desde{" "}
          <strong>Oficina &amp; Horarios</strong>.
        </p>

        <FormField
          label="Título del panel de horario"
          type="text"
          required
          value={formData.officeMapTitle}
          onChange={(e) => updateField("officeMapTitle", e.target.value)}
          placeholder="Ej: Horario de atención"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            label="Etiqueta &quot;Antes de venir&quot;"
            type="text"
            required
            value={formData.officeVisitLabel}
            onChange={(e) => updateField("officeVisitLabel", e.target.value)}
          />
          <FormField
            label="Nota de &quot;antes de venir&quot;"
            type="text"
            required
            value={formData.officeVisitNote}
            onChange={(e) => updateField("officeVisitNote", e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter uppercase tracking-wide">
            Mapa y etiquetas
          </label>

          <FormField
            label="Insignia sobre el título lateral (Ej: Mapa real integrado)"
            type="text"
            required
            value={formData.officeMapEyebrow}
            onChange={(e) => updateField("officeMapEyebrow", e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Título de la etiqueta flotante del pin"
              type="text"
              required
              value={formData.officeMapPinTitle}
              onChange={(e) => updateField("officeMapPinTitle", e.target.value)}
            />
            <FormField
              label="Subtítulo de la etiqueta flotante del pin"
              type="text"
              required
              value={formData.officeMapPinSubtitle}
              onChange={(e) => updateField("officeMapPinSubtitle", e.target.value)}
            />
          </div>

          <FormField
            label="Texto del link a Google Maps"
            type="text"
            required
            value={formData.officeMapsLinkText}
            onChange={(e) => updateField("officeMapsLinkText", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
