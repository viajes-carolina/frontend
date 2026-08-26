"use client";

import React from "react";
import { Button, Disclosure, FormField } from "@vc/ui";
import { useAdminAbout } from "../../../hooks/useAdminAbout";
import { HeroPhotoSlot } from "../../../components/HeroPhotoSlot";

export function CabeceraForm() {
  const {
    formData,
    heroMediaUrl,
    loading,
    saving,
    feedbackMessage,
    updateField,
    handleSelectHeroMedia,
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
        <h2 className="font-sora font-bold text-lg text-brand-navy">1. Cabecera & Foto Principal</h2>

        <HeroPhotoSlot
          variant="main"
          label="Foto del Hero"
          helperText="Foto real de viajeros — reemplaza a las estadísticas del diseño anterior."
          mediaId={formData.heroMediaId}
          mediaUrl={heroMediaUrl}
          focalX={formData.heroFocalX}
          focalY={formData.heroFocalY}
          onSelect={handleSelectHeroMedia}
          modalTitle="Seleccionar Foto del Hero de Nosotros"
        />

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

        <Disclosure summary="Opciones adicionales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Badge de la tarjeta flotante"
                type="text"
                value={formData.heroCardBadge || ""}
                onChange={(e) => updateField("heroCardBadge", e.target.value)}
              />
            </div>
            <div>
              <FormField
                label="Título de la tarjeta flotante"
                type="text"
                value={formData.heroCardTitle || ""}
                onChange={(e) => updateField("heroCardTitle", e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <FormField
              label="Nota flotante (tarjeta secundaria)"
              type="text"
              value={formData.heroNoteText || ""}
              onChange={(e) => updateField("heroNoteText", e.target.value)}
            />
          </div>
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
