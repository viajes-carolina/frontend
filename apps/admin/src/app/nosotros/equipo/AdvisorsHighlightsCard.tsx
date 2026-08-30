"use client";

import React from "react";
import { FormCard, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

// Encabezado editorial de la sección "03 · Quién está detrás" (badge + las 2
// "voces de apoyo" mostradas junto a la asesora protagonista) — vive en el
// mismo `about_page` que el resto de Nosotros, por eso reutiliza useAdminAbout
// en vez de useAdminAdvisors (ese hook solo gestiona el CRUD de asesoras).
export function AdvisorsHighlightsCard() {
  const { formData, loading, saving, feedback, updateField, updateAdvisorsHighlight, handleSave } = useAdminAbout();

  if (loading) {
    return <FormSkeleton className="max-w-5xl" />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <FormCard
      title="03 · Quién está detrás (encabezado)"
      description="Badge de la sección y las dos voces de apoyo que acompañan a la asesora protagonista en la página pública."
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Encabezado del Equipo"
      className="max-w-5xl"
    >
      <FormField
        label="Badge / Distintivo"
        type="text"
        value={formData.advisorsBadge || ""}
        onChange={(e) => updateField("advisorsBadge", e.target.value)}
        placeholder="03 · QUIÉN ESTÁ DETRÁS"
      />

      <div className="space-y-4">
        <p className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Voces de apoyo (junto a la asesora protagonista)
        </p>
        {formData.advisorsHighlights.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-4 rounded-[12px] border border-neutral-border bg-neutral-soft p-4 sm:grid-cols-2"
          >
            <FormField
              label={`Voz ${idx + 1} · Título`}
              type="text"
              value={item.title}
              onChange={(e) => updateAdvisorsHighlight(idx, "title", e.target.value)}
              placeholder="Orientación personalizada"
            />
            <FormField
              label={`Voz ${idx + 1} · Descripción`}
              type="text"
              value={item.body}
              onChange={(e) => updateAdvisorsHighlight(idx, "body", e.target.value)}
              placeholder="Basada en tus fechas, presupuesto y prioridades."
            />
          </div>
        ))}
      </div>
    </FormCard>
  );
}
