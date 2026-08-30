"use client";

import React from "react";
import { Disclosure, FormCard, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function CabeceraForm() {
  const { formData, loading, saving, feedback, updateField, handleSave } = useAdminAbout();

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  return (
    <FormCard
      title="01 · Cabecera"
      description="Primera pantalla de la página Nosotros: badge, titular, subtítulo y la ficha institucional flotante."
      feedback={feedback}
      onSubmit={handleSave}
      saving={saving}
      submitLabel="Guardar Cabecera"
    >
      <FormField
        label="Badge / Distintivo Superior"
        type="text"
        value={formData.heroBadge}
        onChange={(e) => updateField("heroBadge", e.target.value)}
        required
      />

      <FormField
        label="Título Principal (H1)"
        type="text"
        value={formData.heroTitle}
        onChange={(e) => updateField("heroTitle", e.target.value)}
        required
      />

      <FormField
        label="Subtítulo Descriptivo"
        multiline
        rows={2}
        value={formData.heroSubtitle}
        onChange={(e) => updateField("heroSubtitle", e.target.value)}
        required
      />

      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Ficha institucional flotante
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Badge de la ficha"
            type="text"
            value={formData.heroCardBadge || ""}
            onChange={(e) => updateField("heroCardBadge", e.target.value)}
            placeholder="VIAJES CAROLINA"
          />
          <FormField
            label="Título de la ficha"
            type="text"
            value={formData.heroCardTitle || ""}
            onChange={(e) => updateField("heroCardTitle", e.target.value)}
            placeholder="Agencia de viajes"
          />
          <FormField
            label="Ubicación (línea)"
            type="text"
            value={formData.heroCardLocation || ""}
            onChange={(e) => updateField("heroCardLocation", e.target.value)}
            placeholder="Lima, Perú"
          />
          <FormField
            label="Detalle (2 líneas)"
            multiline
            rows={2}
            value={formData.heroCardDetail || ""}
            onChange={(e) => updateField("heroCardDetail", e.target.value)}
            placeholder={"Atención directa con Carolina\nAsesoría · Organización · Seguimiento"}
          />
        </div>
      </div>

      <Disclosure summary="Opciones adicionales">
        <FormField
          label="Nota de confianza (bajo el botón de WhatsApp)"
          type="text"
          value={formData.heroNoteText || ""}
          onChange={(e) => updateField("heroNoteText", e.target.value)}
        />
      </Disclosure>
    </FormCard>
  );
}
