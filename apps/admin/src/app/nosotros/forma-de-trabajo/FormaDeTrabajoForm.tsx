"use client";

import React from "react";
import { FormCard, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function FormaDeTrabajoForm() {
  const { formData, loading, saving, feedback, updateField, updateAccompanyStep, handleSave } = useAdminAbout();

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  return (
    <FormCard
      title="02 · Nuestra forma de trabajar"
      description="Encabezado de la sección y los tres principios que la acompañan en la página pública."
      feedback={feedback}
      onSubmit={handleSave}
      saving={saving}
      submitLabel="Guardar Forma de Trabajo"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Badge / Distintivo"
          type="text"
          value={formData.accompanyBadge || ""}
          onChange={(e) => updateField("accompanyBadge", e.target.value)}
        />
        <FormField
          label="Título de sección"
          type="text"
          value={formData.accompanyTitle || ""}
          onChange={(e) => updateField("accompanyTitle", e.target.value)}
        />
      </div>

      <FormField
        label="Subtítulo"
        multiline
        rows={2}
        value={formData.accompanySubtitle || ""}
        onChange={(e) => updateField("accompanySubtitle", e.target.value)}
      />

      {/* Los 3 principios son campos fijos — ya no una lista libre de tamaño variable */}
      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Los 3 principios (título + descripción)
        </h3>
        {formData.accompanySteps.map((step, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-3 rounded-[10px] border border-admin-divider bg-admin-field p-4 sm:grid-cols-2"
          >
            <FormField
              label={`Principio ${idx + 1} · Título`}
              type="text"
              value={step.title}
              onChange={(e) => updateAccompanyStep(idx, "title", e.target.value)}
              placeholder="01 · Escuchar primero"
            />
            <FormField
              label={`Principio ${idx + 1} · Descripción`}
              type="text"
              value={step.body}
              onChange={(e) => updateAccompanyStep(idx, "body", e.target.value)}
              placeholder="Entendemos tus fechas, presupuesto y prioridades."
            />
          </div>
        ))}
      </div>

      <FormField
        label="Badge de cierre (frase corta)"
        multiline
        rows={2}
        value={formData.accompanyQuote || ""}
        onChange={(e) => updateField("accompanyQuote", e.target.value)}
        placeholder="Una sola asesora. Una conversación continua."
      />
    </FormCard>
  );
}
