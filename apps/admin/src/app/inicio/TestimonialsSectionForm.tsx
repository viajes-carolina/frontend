"use client";

import React from "react";
import type { HomeTestimonialsSectionDTO } from "@vc/api-client";
import { FormField, FormSkeleton } from "@vc/ui";
import { useAdminTestimonialsSection } from "../../hooks/useAdminTestimonialsSection";
import { HeroPhotoSlot } from "../../components/HeroPhotoSlot";

interface TestimonialsSectionFormProps {
  initialConfig?: HomeTestimonialsSectionDTO;
}

export const TestimonialsSectionForm: React.FC<TestimonialsSectionFormProps> = ({ initialConfig }) => {
  const {
    config,
    loading,
    saving,
    error,
    success,
    updateField,
    saveConfig,
    handleSelectBlobMedia,
  } = useAdminTestimonialsSection(initialConfig);

  if (loading) {
    return <FormSkeleton />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la configuración de la sección de Experiencias.
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
          Experiencias / Testimonios (sección 05)
        </h2>
        <p className="text-xs text-neutral-muted mt-1">
          Título, descripción y fotos de la sección. Los testimonios de clientes se editan más abajo en esta misma página.
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

      <div className="p-4 rounded-2xl bg-neutral-surface/60 border border-neutral-border">
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

      <div className="grid grid-cols-1 gap-6">
        <div>
          <FormField
            label="Badge Superior"
            type="text"
            value={config.badgeText}
            onChange={(e) => updateField("badgeText", e.target.value)}
            placeholder="05 · Historias reales"
            required
          />
        </div>

        <div>
          <FormField
            label="Título"
            type="text"
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Viajes que hoy se recuerdan así"
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
            placeholder="Cada fotografía guarda una experiencia que comenzó con una conversación."
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
