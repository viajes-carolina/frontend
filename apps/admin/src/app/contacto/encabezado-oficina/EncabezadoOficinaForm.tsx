"use client";

import React from "react";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminContact } from "../../../hooks/useAdminContact";

export function EncabezadoOficinaForm() {
  const { pageSettings, formData, updateField, loading, saving, error, feedback, handleSaveSettings } =
    useAdminContact();

  if (loading) {
    return <FormSkeleton fields={8} className="max-w-4xl" />;
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
      title="2. Oficina & Mapa"
      description="La dirección junto al título y el horario del panel se muestran automáticamente desde Oficina & Horarios."
      feedback={feedback}
      onSubmit={handleSaveSettings}
      saving={saving}
      submitLabel="Guardar Encabezado de Oficina"
    >
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

      <FormField
        label="Título del panel de horario"
        type="text"
        required
        value={formData.officeMapTitle}
        onChange={(e) => updateField("officeMapTitle", e.target.value)}
        placeholder="Ej: Horario de atención"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Mapa y etiquetas
        </h3>

        <FormField
          label="Insignia sobre el título lateral (Ej: Mapa real integrado)"
          type="text"
          required
          value={formData.officeMapEyebrow}
          onChange={(e) => updateField("officeMapEyebrow", e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
    </FormCard>
  );
}
