"use client";

import React from "react";
import { Button, CheckIcon, Disclosure, FormField, FormSkeleton } from "@vc/ui";
import { useAdminContact } from "../../../hooks/useAdminContact";

export function HeroForm() {
  const { pageSettings, formData, updateField, loading, saving, saveSuccess, error, handleSaveSettings } =
    useAdminContact();

  if (loading) {
    return <FormSkeleton fields={12} />;
  }

  if (!pageSettings) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
        ⚠️ {error || "No se pudo cargar la configuración de contacto."}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter mb-6">
          ⚠️ {error}
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-inter flex items-center gap-2 mb-6">
          <CheckIcon size={16} className="text-emerald-600" />
          <span>Configuración de Contacto actualizada con éxito.</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-4 max-w-4xl">
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

        <Disclosure summary="Tarjeta de información de contacto (auto-poblada)">
          <p className="text-xs text-neutral-muted font-inter -mt-1 mb-3">
            El correo, el horario y la dirección se muestran automáticamente desde Identidad &amp; WhatsApp y
            Oficina &amp; Horarios — aquí solo editas el título y las etiquetas.
          </p>

          <div className="space-y-3">
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
        </Disclosure>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSaveSettings()} disabled={saving}>
            Guardar Hero & Encabezado
          </Button>
        </div>
      </div>
    </>
  );
}
