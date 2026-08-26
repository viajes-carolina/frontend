"use client";

import React from "react";
import type { HomeTestimonialsSectionDTO } from "@vc/api-client";
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
    return (
      <div className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-20 bg-slate-200 rounded"></div>
      </div>
    );
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
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Badge Superior
          </label>
          <input
            type="text"
            value={config.badgeText}
            onChange={(e) => updateField("badgeText", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="05 · Historias reales"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Título
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Viajes que hoy se recuerdan así"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Subtítulo
          </label>
          <textarea
            value={config.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
