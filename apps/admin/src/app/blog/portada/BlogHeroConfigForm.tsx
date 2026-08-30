"use client";

import React from "react";
import type { BlogHeroConfigDTO } from "@vc/api-client";
import { FormField, FormSkeleton } from "@vc/ui";
import { useAdminBlogHero } from "../../../hooks/useAdminBlogHero";

interface BlogHeroConfigFormProps {
  initialConfig?: BlogHeroConfigDTO;
}

export const BlogHeroConfigForm: React.FC<BlogHeroConfigFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, success, updateField, saveConfig } = useAdminBlogHero(initialConfig);

  if (loading) {
    return <FormSkeleton fields={4} />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la portada del blog.
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
        <h2 className="text-xl font-bold text-brand-navy">Portada del Blog (sección 01, hero de /blog)</h2>
        <p className="text-xs text-neutral-muted mt-1">
          Encabezado del listado de artículos: eyebrow, título, descripción y etiqueta de edición.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            label="Eyebrow (texto superior)"
            type="text"
            value={config.eyebrowText}
            onChange={(e) => updateField("eyebrowText", e.target.value)}
            placeholder="BITÁCORA · VIAJES CAROLINA"
            required
          />
        </div>

        <div>
          <FormField
            label="Etiqueta de Edición"
            type="text"
            value={config.editionLabel}
            onChange={(e) => updateField("editionLabel", e.target.value)}
            placeholder="EDICIÓN 01 · AGOSTO 2026"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Título Principal"
            multiline
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            rows={2}
            placeholder="El diario de Viajes Carolina"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Descripción"
            multiline
            value={config.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            placeholder="Guías claras, ideas y respuestas para preparar el viaje con más confianza y menos ruido."
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
