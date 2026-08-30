"use client";

import React from "react";
import type { HomeBlogInspirationDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSelect, FormSkeleton, Toggle } from "@vc/ui";
import { useAdminBlogInspiration } from "../../hooks/useAdminBlogInspiration";

interface BlogInspirationFormProps {
  initialConfig?: HomeBlogInspirationDTO;
}

export const BlogInspirationForm: React.FC<BlogInspirationFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, feedback, updateField, saveConfig } =
    useAdminBlogInspiration(initialConfig);

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{
          tone: "error",
          message: error || "No se pudo cargar la configuración de la sección de inspiración.",
        }}
      />
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConfig();
  };

  return (
    <FormCard
      title="Sección de Inspiración (Blog en Home)"
      description="Personaliza los títulos, subtítulos, cantidad de artículos y visibilidad en la portada principal."
      headerAside={
        <Toggle
          checked={config.active}
          onChange={(checked) => updateField("active", checked)}
          label={config.active ? "Visible en Home" : "Oculto"}
          aria-label="Mostrar la sección de inspiración en la portada"
        />
      }
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Configuración"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Badge Superior"
          type="text"
          value={config.badgeText}
          onChange={(e) => updateField("badgeText", e.target.value)}
          placeholder="Inspiración para tu viaje"
          required
        />

        <FormSelect
          label="Límite de Artículos a Mostrar"
          value={config.postsLimit}
          onChange={(e) => updateField("postsLimit", Number(e.target.value))}
        >
          <option value={3}>3 artículos (Recomendado - 1 fila)</option>
          <option value={6}>6 artículos (2 filas)</option>
        </FormSelect>

        <FormField
          label="Título Principal (Texto Base)"
          type="text"
          value={config.titleHighlight}
          onChange={(e) => updateField("titleHighlight", e.target.value)}
          placeholder="Consejos y guías"
          required
        />

        <FormField
          label="Título Destacado (Texto con Acento/Itálica)"
          type="text"
          value={config.titleAccent}
          onChange={(e) => updateField("titleAccent", e.target.value)}
          placeholder="para explorar el mundo"
          required
        />

        <FormField
          label="Subtítulo Descriptivo"
          multiline
          rows={3}
          value={config.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          placeholder="Descubre recomendaciones de viaje, mejores temporadas..."
          required
          wrapperClassName="md:col-span-2"
        />

        <FormField
          label="Texto del Botón CTA"
          type="text"
          value={config.ctaText}
          onChange={(e) => updateField("ctaText", e.target.value)}
          placeholder="Ver todos los artículos del blog"
          required
        />

        <FormField
          label="Enlace URL del Botón CTA"
          type="text"
          value={config.ctaUrl}
          onChange={(e) => updateField("ctaUrl", e.target.value)}
          placeholder="/blog"
          required
        />
      </div>
    </FormCard>
  );
};
