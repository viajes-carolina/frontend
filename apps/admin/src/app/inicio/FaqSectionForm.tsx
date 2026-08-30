"use client";

import React from "react";
import type { HomeFaqSectionDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminFaqSection } from "../../hooks/useAdminFaqSection";

interface FaqSectionFormProps {
  initialConfig?: HomeFaqSectionDTO;
}

export const FaqSectionForm: React.FC<FaqSectionFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, feedback, updateField, saveConfig } = useAdminFaqSection(initialConfig);

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{
          tone: "error",
          message: error || "No se pudo cargar la configuración de la sección de FAQ.",
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
      title="Preguntas Frecuentes (sección 06)"
      description="Título y descripción de la sección. Las preguntas individuales se editan más abajo en esta misma página."
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Configuración"
    >
      <FormField
        label="Badge Superior"
        type="text"
        value={config.badgeText}
        onChange={(e) => updateField("badgeText", e.target.value)}
        placeholder="06 · Antes de continuar"
        required
      />

      <FormField
        label="Título"
        type="text"
        value={config.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Lo que solemos conversar antes de viajar"
        required
      />

      <FormField
        label="Subtítulo"
        multiline
        rows={2}
        value={config.subtitle}
        onChange={(e) => updateField("subtitle", e.target.value)}
        placeholder="Es normal tener dudas sobre fechas, pagos o destinos. Aquí respondemos las más frecuentes."
        required
      />
    </FormCard>
  );
};
