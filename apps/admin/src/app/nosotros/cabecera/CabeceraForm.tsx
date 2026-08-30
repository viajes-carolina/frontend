"use client";

import React from "react";
import { Button, Disclosure, FormField, FormSkeleton } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";

export function CabeceraForm() {
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
        <h2 className="font-sora font-bold text-lg text-brand-navy">01 · Cabecera</h2>

        <div>
          <FormField
            label="Badge / Distintivo Superior"
            type="text"
            value={formData.heroBadge}
            onChange={(e) => updateField("heroBadge", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Título Principal (H1)"
            type="text"
            value={formData.heroTitle}
            onChange={(e) => updateField("heroTitle", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Subtítulo Descriptivo"
            multiline
            rows={2}
            value={formData.heroSubtitle}
            onChange={(e) => updateField("heroSubtitle", e.target.value)}
            required
          />
        </div>

        <div className="pt-2 border-t border-neutral-border">
          <h3 className="font-sora font-semibold text-sm text-brand-navy mb-4">Ficha institucional flotante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Badge de la ficha"
                type="text"
                value={formData.heroCardBadge || ""}
                onChange={(e) => updateField("heroCardBadge", e.target.value)}
                placeholder="VIAJES CAROLINA"
              />
            </div>
            <div>
              <FormField
                label="Título de la ficha"
                type="text"
                value={formData.heroCardTitle || ""}
                onChange={(e) => updateField("heroCardTitle", e.target.value)}
                placeholder="Agencia de viajes"
              />
            </div>
            <div>
              <FormField
                label="Ubicación (línea)"
                type="text"
                value={formData.heroCardLocation || ""}
                onChange={(e) => updateField("heroCardLocation", e.target.value)}
                placeholder="Lima, Perú"
              />
            </div>
            <div>
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
        </div>

        <Disclosure summary="Opciones adicionales">
          <FormField
            label="Nota de confianza (bajo el botón de WhatsApp)"
            type="text"
            value={formData.heroNoteText || ""}
            onChange={(e) => updateField("heroNoteText", e.target.value)}
          />
        </Disclosure>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={saving}>
            Guardar Cabecera
          </Button>
        </div>
      </div>
    </>
  );
}
