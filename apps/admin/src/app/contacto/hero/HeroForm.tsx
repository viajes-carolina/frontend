"use client";

import React from "react";
import { Disclosure, FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminContact } from "../../../hooks/useAdminContact";

export function HeroForm() {
  const { pageSettings, formData, updateField, loading, saving, error, feedback, handleSaveSettings } =
    useAdminContact();

  if (loading) {
    return <FormSkeleton fields={12} className="max-w-4xl" />;
  }

  if (!pageSettings) {
    return (
      <FormFeedback
        feedback={{ tone: "error", message: error || "No se pudo cargar la configuración de contacto." }}
      />
    );
  }

  return (
    <FormCard
      title="1. Hero & Encabezado Principal"
      description="Primera pantalla de la página de Contacto: badge, titular, subtítulo y el CTA de WhatsApp."
      feedback={feedback}
      onSubmit={handleSaveSettings}
      saving={saving}
      submitLabel="Guardar Hero & Encabezado"
    >
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

      <Disclosure summary="Tarjeta de información de contacto (auto-poblada)">
        <p className="-mt-1 mb-3 font-inter text-xs text-neutral-muted">
          El correo, el horario y la dirección se muestran automáticamente desde Identidad &amp; WhatsApp y
          Oficina &amp; Horarios — aquí solo editas el título y las etiquetas.
        </p>

        <div className="space-y-4">
          <FormField
            label="Título de la tarjeta"
            type="text"
            required
            value={formData.heroInfoTitle}
            onChange={(e) => updateField("heroInfoTitle", e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
      </Disclosure>
    </FormCard>
  );
}
