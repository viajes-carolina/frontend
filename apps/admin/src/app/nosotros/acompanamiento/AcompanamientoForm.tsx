"use client";

import React from "react";
import { Button, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function AcompanamientoForm() {
  const {
    formData,
    loading,
    saving,
    feedbackMessage,
    updateField,
    newAccompanyStepTitle,
    setNewAccompanyStepTitle,
    newAccompanyStepBody,
    setNewAccompanyStepBody,
    addAccompanyStep,
    removeAccompanyStep,
    handleSave,
  } = useAdminAbout();

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
        <h2 className="font-sora font-bold text-lg text-brand-navy">4. Cómo te acompañamos</h2>

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

        {/* Accompany Steps */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Pasos verticales (título + descripción)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newAccompanyStepTitle}
              onChange={(e) => setNewAccompanyStepTitle(e.target.value)}
              placeholder="Título del paso"
              className="bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <input
              type="text"
              value={newAccompanyStepBody}
              onChange={(e) => setNewAccompanyStepBody(e.target.value)}
              placeholder="Descripción del paso"
              className="bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addAccompanyStep} className="!py-2 text-xs">
            + Agregar Paso
          </Button>

          <div className="space-y-2 pt-2">
            {formData.accompanySteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-neutral-soft border border-neutral-border rounded-xl px-4 py-2.5"
              >
                <div>
                  <p className="text-brand-navy text-sm font-semibold">{step.title}</p>
                  <p className="text-neutral-muted text-xs mt-0.5">{step.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAccompanyStep(idx)}
                  className="text-neutral-muted hover:text-red-500 font-bold shrink-0"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <FormField
              label="Cita (Promesa Humana)"
              multiline
              rows={2}
              value={formData.accompanyQuote || ""}
              onChange={(e) => updateField("accompanyQuote", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Atribución de la Cita"
              type="text"
              value={formData.accompanyQuoteAttribution || ""}
              onChange={(e) => updateField("accompanyQuoteAttribution", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Acompañamiento
          </Button>
        </div>
      </div>
    </>
  );
}
