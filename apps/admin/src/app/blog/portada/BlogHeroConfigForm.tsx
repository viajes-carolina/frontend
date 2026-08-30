"use client";

import React from "react";
import type { BlogHeroConfigDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminBlogHero } from "../../../hooks/useAdminBlogHero";

interface BlogHeroConfigFormProps {
  initialConfig?: BlogHeroConfigDTO;
}

export const BlogHeroConfigForm: React.FC<BlogHeroConfigFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, feedback, updateField, saveConfig } = useAdminBlogHero(initialConfig);

  if (loading) {
    return <FormSkeleton fields={4} className="max-w-4xl" />;
  }

  if (!config) {
    return <FormFeedback feedback={{ tone: "error", message: error || "No se pudo cargar la portada del blog." }} />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConfig();
  };

  return (
    <FormCard
      title="Portada del Blog (sección 01, hero de /blog)"
      description="Encabezado del listado de artículos: eyebrow, título, descripción y etiqueta de edición."
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Configuración"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Eyebrow (texto superior)"
          type="text"
          value={config.eyebrowText}
          onChange={(e) => updateField("eyebrowText", e.target.value)}
          placeholder="BITÁCORA · VIAJES CAROLINA"
          required
        />

        <FormField
          label="Etiqueta de Edición"
          type="text"
          value={config.editionLabel}
          onChange={(e) => updateField("editionLabel", e.target.value)}
          placeholder="EDICIÓN 01 · AGOSTO 2026"
          required
        />

        <FormField
          label="Título Principal"
          multiline
          rows={2}
          value={config.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="El diario de Viajes Carolina"
          required
          wrapperClassName="md:col-span-2"
        />

        <FormField
          label="Descripción"
          multiline
          rows={3}
          value={config.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Guías claras, ideas y respuestas para preparar el viaje con más confianza y menos ruido."
          required
          wrapperClassName="md:col-span-2"
        />
      </div>
    </FormCard>
  );
};
