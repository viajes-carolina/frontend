"use client";

import React from "react";
import type { HomeTestimonialsSectionDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminTestimonialsSection } from "../../hooks/useAdminTestimonialsSection";
import { HeroPhotoSlot } from "../../components/HeroPhotoSlot";

interface TestimonialsSectionFormProps {
  initialConfig?: HomeTestimonialsSectionDTO;
}

export const TestimonialsSectionForm: React.FC<TestimonialsSectionFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, feedback, updateField, saveConfig, handleSelectBlobMedia } =
    useAdminTestimonialsSection(initialConfig);

  if (loading) {
    return <FormSkeleton className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{
          tone: "error",
          message: error || "No se pudo cargar la configuración de la sección de Experiencias.",
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
      title="Experiencias / Testimonios (sección 05)"
      description="Título, descripción y fotos de la sección. Los testimonios de clientes se editan más abajo en esta misma página."
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Configuración"
    >
      <div className="rounded-[10px] border border-admin-divider bg-admin-field p-4">
        <HeroPhotoSlot
          variant="secondary"
          label="Foto real del viajero"
          mediaId={config.blobMediaId}
          mediaUrl={config.blobMediaUrl}
          focalX={config.blobFocalX}
          focalY={config.blobFocalY}
          onSelect={handleSelectBlobMedia}
          modalTitle="Seleccionar Foto de Experiencias"
        />
      </div>

      <FormField
        label="Badge Superior"
        type="text"
        value={config.badgeText}
        onChange={(e) => updateField("badgeText", e.target.value)}
        placeholder="05 · Historias reales"
        required
      />

      <FormField
        label="Título"
        type="text"
        value={config.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Viajes que hoy se recuerdan así"
        required
      />

      <FormField
        label="Subtítulo"
        multiline
        rows={2}
        value={config.subtitle}
        onChange={(e) => updateField("subtitle", e.target.value)}
        placeholder="Cada fotografía guarda una experiencia que comenzó con una conversación."
        required
      />
    </FormCard>
  );
};
