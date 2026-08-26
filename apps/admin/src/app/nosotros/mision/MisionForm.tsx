"use client";

import React from "react";
import { Button, FormField } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function MisionForm() {
  const {
    formData,
    loading,
    saving,
    feedbackMessage,
    updateField,
    newJourneyStepText,
    setNewJourneyStepText,
    addJourneyStep,
    removeJourneyStep,
    handleSave,
  } = useAdminAbout();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm animate-pulse space-y-4 max-w-4xl">
        <div className="h-6 bg-neutral-border rounded w-1/4"></div>
        <div className="h-10 bg-neutral-border rounded"></div>
        <div className="h-20 bg-neutral-border rounded"></div>
      </div>
    );
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
        <h2 className="font-sora font-bold text-lg text-brand-navy">
          3. Misión & Ruta &quot;de idea a recuerdo&quot;
        </h2>

        <div>
          <FormField
            label="Título Misión"
            type="text"
            value={formData.missionTitle}
            onChange={(e) => updateField("missionTitle", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Declaración de Misión"
            multiline
            rows={4}
            value={formData.missionBody}
            onChange={(e) => updateField("missionBody", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Cita Editorial"
            multiline
            rows={2}
            value={formData.missionQuote || ""}
            onChange={(e) => updateField("missionQuote", e.target.value)}
          />
        </div>

        {/* Journey Steps */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-muted uppercase">
            Pasos de la Ruta (4 pasos horizontales)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newJourneyStepText}
              onChange={(e) => setNewJourneyStepText(e.target.value)}
              placeholder="Ej: Escuchamos tu idea"
              className="flex-1 bg-neutral-soft border border-neutral-border rounded-xl px-3.5 py-2 text-neutral-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <Button type="button" variant="secondary" onClick={addJourneyStep} className="!py-2 text-xs">
              + Agregar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.journeySteps.map((step, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-soft text-brand-navy text-xs border border-neutral-border"
              >
                {step.label}
                <button
                  type="button"
                  onClick={() => removeJourneyStep(idx)}
                  className="text-neutral-muted hover:text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Misión
          </Button>
        </div>
      </div>
    </>
  );
}
