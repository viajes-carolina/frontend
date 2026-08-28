"use client";

import React from "react";
import type { HomeFaqSectionDTO } from "@vc/api-client";
import { FormField, FormSkeleton } from "@vc/ui";
import { useAdminFaqSection } from "../../hooks/useAdminFaqSection";

interface FaqSectionFormProps {
  initialConfig?: HomeFaqSectionDTO;
}

export const FaqSectionForm: React.FC<FaqSectionFormProps> = ({ initialConfig }) => {
  const {
    config,
    loading,
    saving,
    error,
    success,
    updateField,
    saveConfig,
  } = useAdminFaqSection(initialConfig);

  if (loading) {
    return <FormSkeleton />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la configuración de la sección de FAQ.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm space-y-6">
      <div className="border-b border-neutral-border pb-4">
        <h2 className="text-xl font-bold text-brand-navy">
          Preguntas Frecuentes (sección 06)
        </h2>
        <p className="text-xs text-neutral-muted mt-1">
          Título y descripción de la sección. Las preguntas individuales se editan más abajo en esta misma página.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          Configuración guardada exitosamente en el servidor.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <FormField
            label="Badge Superior"
            type="text"
            value={config.badgeText}
            onChange={(e) => updateField("badgeText", e.target.value)}
            placeholder="06 · Antes de continuar"
            required
          />
        </div>

        <div>
          <FormField
            label="Título"
            type="text"
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Lo que solemos conversar antes de viajar"
            required
          />
        </div>

        <div>
          <FormField
            label="Subtítulo"
            multiline
            value={config.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            rows={2}
            placeholder="Es normal tener dudas sobre fechas, pagos o destinos. Aquí respondemos las más frecuentes."
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-border">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-brand-accent hover:bg-brand-sunset text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </form>
  );
};
