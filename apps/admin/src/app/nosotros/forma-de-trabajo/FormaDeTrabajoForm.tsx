"use client";

import React from "react";
import { Button, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function FormaDeTrabajoForm() {
  const { formData, loading, saving, feedbackMessage, updateField, updateAccompanyStep, handleSave } = useAdminAbout();

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  return (
    <>
      {feedbackMessage && (
        <div
          className={`mb-8 p-4 rounded-xl text-sm font-medium border ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      <div className="bg-white border border-neutral-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl">
        <h2 className="font-sora font-bold text-lg text-brand-navy">02 · Nuestra forma de trabajar</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge / Distintivo"
              type="text"
              value={formData.accompanyBadge || ""}
              onChange={(e) => updateField("accompanyBadge", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Título de sección"
              type="text"
              value={formData.accompanyTitle || ""}
              onChange={(e) => updateField("accompanyTitle", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Subtítulo"
            multiline
            rows={2}
            value={formData.accompanySubtitle || ""}
            onChange={(e) => updateField("accompanySubtitle", e.target.value)}
          />
        </div>

        {/* Los 3 principios son campos fijos — ya no una lista libre de tamaño variable */}
        <div className="space-y-4 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Los 3 principios (título + descripción)
          </label>
          {formData.accompanySteps.map((step, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-soft border border-neutral-border rounded-xl p-4">
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

        <div className="pt-2">
          <FormField
            label="Badge de cierre (frase corta)"
            multiline
            rows={2}
            value={formData.accompanyQuote || ""}
            onChange={(e) => updateField("accompanyQuote", e.target.value)}
            placeholder="Una sola asesora. Una conversación continua."
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Forma de Trabajo
          </Button>
        </div>
      </div>
    </>
  );
}
