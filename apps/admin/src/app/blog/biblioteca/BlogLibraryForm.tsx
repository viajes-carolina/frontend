"use client";

import React from "react";
import type { BlogLibraryDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminBlogLibrary } from "../../../hooks/useAdminBlogLibrary";

interface BlogLibraryFormProps {
  initialConfig?: BlogLibraryDTO;
}

export const BlogLibraryForm: React.FC<BlogLibraryFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, feedback, updateField, saveConfig } = useAdminBlogLibrary(initialConfig);

  if (loading) {
    return <FormSkeleton fields={3} className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{ tone: "error", message: error || 'No se pudo cargar la sección "Biblioteca".' }}
      />
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConfig();
  };

  return (
    <FormCard
      title="Biblioteca (sección 02, buscador y grilla completa de /blog)"
      description="Encabezado del bloque de exploración: eyebrow, título y descripción sobre el buscador, el filtro de categorías y la grilla con todos los artículos."
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Configuración"
    >
      <FormField
        label="Eyebrow (texto superior, sin el conteo de artículos)"
        type="text"
        value={config.eyebrowText}
        onChange={(e) => updateField("eyebrowText", e.target.value)}
        placeholder="01 · TODAS LAS HISTORIAS"
        required
      />

      <FormField
        label="Título"
        multiline
        rows={2}
        value={config.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Explora la bitácora"
        required
      />

      <FormField
        label="Descripción"
        multiline
        rows={3}
        value={config.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Busca por tema, filtra por categoría y recorre el archivo a tu ritmo."
        required
      />
    </FormCard>
  );
};
