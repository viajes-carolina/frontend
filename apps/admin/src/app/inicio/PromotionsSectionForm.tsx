"use client";

import React from "react";
import type { HomePromotionsSectionDTO } from "@vc/api-client";
import { useAdminPromotionsSection } from "../../hooks/useAdminPromotionsSection";

interface PromotionsSectionFormProps {
  initialConfig?: HomePromotionsSectionDTO;
}

export const PromotionsSectionForm: React.FC<PromotionsSectionFormProps> = ({ initialConfig }) => {
  const {
    config,
    loading,
    saving,
    error,
    success,
    updateField,
    saveConfig,
  } = useAdminPromotionsSection(initialConfig);

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
        No se pudo cargar la configuración de la sección de Promociones.
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
          Encabezado de Promociones (sección 02)
        </h2>
        <p className="text-xs text-neutral-muted mt-1">
          Título y descripción de la sección, más el cierre "Propuesta a medida" al final de las tarjetas. El
          título, precio, foto e inclusiones de cada promoción se crean más abajo en esta misma página — la
          tarjeta protagonista y las secundarias usan la foto de cada promoción (`featuredMediaUrl`); si una
          promoción no tiene foto, se muestra un color de fondo en su lugar. Al crear una promoción se publica
          automáticamente un post en la Página de Facebook, y desde ahí también puedes elegir cuáles mostrar u
          ocultar en Inicio.
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
        <div className="md:col-span-2 pt-2 border-t border-neutral-border">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Badge Superior
          </label>
          <input
            type="text"
            value={config.badgeText}
            onChange={(e) => updateField("badgeText", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="02 · Viajes para empezar a imaginar"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Título
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Algunas formas de vivir tu próximo viaje"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Subtítulo
          </label>
          <textarea
            value={config.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Experiencias que podemos ajustar a tus tiempos, compañía y presupuesto."
            required
          />
        </div>

        <div className="md:col-span-2 pt-2 border-t border-neutral-border">
          <p className="text-xs font-bold text-brand-navy uppercase tracking-wider">
            Cierre "Propuesta a medida" (panel navy después de las tarjetas)
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Eyebrow
          </label>
          <input
            type="text"
            value={config.bottomCtaEyebrow}
            onChange={(e) => updateField("bottomCtaEyebrow", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="SI NINGUNO ENCAJA EXACTAMENTE"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Título
          </label>
          <input
            type="text"
            value={config.bottomCtaQuestion}
            onChange={(e) => updateField("bottomCtaQuestion", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Cuéntanos qué imaginas y lo armamos contigo."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Copy
          </label>
          <textarea
            value={config.bottomCtaCopy}
            onChange={(e) => updateField("bottomCtaCopy", e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Fechas, presupuesto y tipo de viaje: una asesora prepara opciones reales para ti."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Texto del Botón de WhatsApp
          </label>
          <input
            type="text"
            value={config.bottomCtaWhatsappText}
            onChange={(e) => updateField("bottomCtaWhatsappText", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Cuéntanos cuál te gustó"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Mensaje Prellenado de WhatsApp
          </label>
          <input
            type="text"
            value={config.bottomCtaWhatsappMessage || ""}
            onChange={(e) => updateField("bottomCtaWhatsappMessage", e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="Hola Viajes Carolina, me gustaría conversar sobre una de sus promociones."
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
