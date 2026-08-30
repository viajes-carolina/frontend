"use client";

import React from "react";
import { Button, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

// Encabezado editorial de la sección "03 · Quién está detrás" (badge + las 2
// "voces de apoyo" mostradas junto a la asesora protagonista) — vive en el
// mismo `about_page` que el resto de Nosotros, por eso reutiliza useAdminAbout
// en vez de useAdminAdvisors (ese hook solo gestiona el CRUD de asesoras).
export function AdvisorsHighlightsCard() {
  const { formData, loading, saving, feedbackMessage, updateField, updateAdvisorsHighlight, handleSave } = useAdminAbout();

  if (loading) {
    return <FormSkeleton className="max-w-5xl" />;
  }

  return (
    <>
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 max-w-5xl">
        <h2 className="font-sora font-bold text-lg text-brand-navy">03 · Quién está detrás (encabezado)</h2>

        <div>
          <FormField
            label="Badge / Distintivo"
            type="text"
            value={formData.advisorsBadge || ""}
            onChange={(e) => updateField("advisorsBadge", e.target.value)}
            placeholder="03 · QUIÉN ESTÁ DETRÁS"
          />
        </div>

        <div className="space-y-4 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Voces de apoyo (junto a la asesora protagonista)
          </label>
          {formData.advisorsHighlights.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-soft border border-neutral-border rounded-xl p-4">
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

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Encabezado del Equipo
          </Button>
        </div>
      </div>
    </>
  );
}
