"use client";

import React from "react";
import { Button, CheckIcon, FormField, FormSkeleton } from "@vc/ui";
import { useAdminContact } from "../../../hooks/useAdminContact";

export function EncabezadoOficinaForm() {
  const { pageSettings, formData, updateField, loading, saving, saveSuccess, error, handleSaveSettings } =
    useAdminContact();

  if (loading) {
    return <FormSkeleton fields={8} />;
  }

  if (!pageSettings) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter">
        ⚠️ {error || "No se pudo cargar la configuración de contacto."}
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-inter mb-6">
          ⚠️ {error}
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-inter flex items-center gap-2 mb-6">
          <CheckIcon size={16} className="text-emerald-600" />
          <span>Configuración de Contacto actualizada con éxito.</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-4 max-w-4xl">
        <h3 className="font-sora font-semibold text-xs text-brand-navy uppercase tracking-wider">
          2. Oficina & Mapa
        </h3>

        <FormField
          label="Insignia / Eyebrow Badge"
          type="text"
          required
          value={formData.officeSectionBadge}
          onChange={(e) => updateField("officeSectionBadge", e.target.value)}
        />

        <FormField
          label="Título de sección"
          type="text"
          required
          value={formData.officeSectionTitle}
          onChange={(e) => updateField("officeSectionTitle", e.target.value)}
        />

        <p className="text-xs text-neutral-muted font-inter">
          La dirección junto al título y el horario del panel se muestran automáticamente desde{" "}
          <strong>Oficina &amp; Horarios</strong>.
        </p>

        <FormField
          label="Título del panel de horario"
          type="text"
          required
          value={formData.officeMapTitle}
          onChange={(e) => updateField("officeMapTitle", e.target.value)}
          placeholder="Ej: Horario de atención"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            label="Etiqueta &quot;Antes de venir&quot;"
            type="text"
            required
            value={formData.officeVisitLabel}
            onChange={(e) => updateField("officeVisitLabel", e.target.value)}
          />
          <FormField
            label="Nota de &quot;antes de venir&quot;"
            type="text"
            required
            value={formData.officeVisitNote}
            onChange={(e) => updateField("officeVisitNote", e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-neutral-dark font-inter uppercase tracking-wide">
            Mapa y etiquetas
          </label>

          <FormField
            label="Insignia sobre el título lateral (Ej: Mapa real integrado)"
            type="text"
            required
            value={formData.officeMapEyebrow}
            onChange={(e) => updateField("officeMapEyebrow", e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Título de la etiqueta flotante del pin"
              type="text"
              required
              value={formData.officeMapPinTitle}
              onChange={(e) => updateField("officeMapPinTitle", e.target.value)}
            />
            <FormField
              label="Subtítulo de la etiqueta flotante del pin"
              type="text"
              required
              value={formData.officeMapPinSubtitle}
              onChange={(e) => updateField("officeMapPinSubtitle", e.target.value)}
            />
          </div>

          <FormField
            label="Texto del link a Google Maps"
            type="text"
            required
            value={formData.officeMapsLinkText}
            onChange={(e) => updateField("officeMapsLinkText", e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSaveSettings()} disabled={saving}>
            Guardar Encabezado de Oficina
          </Button>
        </div>
      </div>
    </>
  );
}
