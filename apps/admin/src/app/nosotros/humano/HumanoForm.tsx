"use client";

import React from "react";
import { Button, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function HumanoForm() {
  const { formData, loading, saving, feedbackMessage, updateField, handleSave } = useAdminAbout();

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
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">6. Una persona al otro lado</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Solo la cabecera es editable — las burbujas de conversación de ejemplo quedan fijas en el sitio
            público.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Badge / Distintivo"
              type="text"
              value={formData.humanBadge || ""}
              onChange={(e) => updateField("humanBadge", e.target.value)}
            />
          </div>
          <div>
            <FormField
              label="Título de sección"
              type="text"
              value={formData.humanTitle || ""}
              onChange={(e) => updateField("humanTitle", e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormField
            label="Subtítulo"
            multiline
            rows={2}
            value={formData.humanSubtitle || ""}
            onChange={(e) => updateField("humanSubtitle", e.target.value)}
          />
        </div>

        <div>
          <FormField
            label="Tagline (Ej: TE LEE · TE ORIENTA · PERMANECE)"
            type="text"
            value={formData.humanTagline || ""}
            onChange={(e) => updateField("humanTagline", e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar &quot;Una persona al otro lado&quot;
          </Button>
        </div>
      </div>
    </>
  );
}
