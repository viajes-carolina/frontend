"use client";

import React from "react";
import type { BlogLibraryDTO } from "@vc/api-client";
import { FormField, FormSkeleton } from "@vc/ui";
import { useAdminBlogLibrary } from "../../../hooks/useAdminBlogLibrary";

interface BlogLibraryFormProps {
  initialConfig?: BlogLibraryDTO;
}

export const BlogLibraryForm: React.FC<BlogLibraryFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, success, updateField, saveConfig } = useAdminBlogLibrary(initialConfig);

  if (loading) {
    return <FormSkeleton fields={3} />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la sección &quot;Biblioteca&quot;.
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
          Biblioteca (sección 02, buscador y grilla completa de /blog)
        </h2>
        <p className="text-xs text-neutral-muted mt-1">
          Encabezado del bloque de exploración: eyebrow, título y descripción sobre el buscador, el filtro de
          categorías y la grilla con todos los artículos.
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
            label="Eyebrow (texto superior, sin el conteo de artículos)"
            type="text"
            value={config.eyebrowText}
            onChange={(e) => updateField("eyebrowText", e.target.value)}
            placeholder="01 · TODAS LAS HISTORIAS"
            required
          />
        </div>

        <div>
          <FormField
            label="Título"
            multiline
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            rows={2}
            placeholder="Explora la bitácora"
            required
          />
        </div>

        <div>
          <FormField
            label="Descripción"
            multiline
            value={config.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            placeholder="Busca por tema, filtra por categoría y recorre el archivo a tu ritmo."
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
