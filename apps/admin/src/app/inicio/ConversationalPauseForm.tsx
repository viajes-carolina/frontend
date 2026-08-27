"use client";

import React from "react";
import type { HomeConversationalPauseDTO } from "@vc/api-client";
import { FormField } from "@vc/ui";
import { useAdminConversationalPause } from "../../hooks/useAdminConversationalPause";

interface ConversationalPauseFormProps {
  initialConfig?: HomeConversationalPauseDTO;
}

export const ConversationalPauseForm: React.FC<ConversationalPauseFormProps> = ({ initialConfig }) => {
  const {
    config,
    loading,
    saving,
    error,
    success,
    updateField,
    financingBanksText,
    setFinancingBanksText,
    saveConfig,
  } = useAdminConversationalPause(initialConfig);

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
        No se pudo cargar la configuración de Pausa Conversacional.
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
          Pausa Conversacional (sección 04, entre Blog y Experiencias)
        </h2>
        <p className="text-xs text-neutral-muted mt-1">
          Bloque de solo-CTA: una pregunta y un botón de WhatsApp, sin tarjetas ni fotos.
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
            label="Badge Superior"
            type="text"
            value={config.badgeText}
            onChange={(e) => updateField("badgeText", e.target.value)}
            placeholder="04 · Antes de seguir"
            required
          />
        </div>

        <div>
          <FormField
            label="Texto del Botón de WhatsApp"
            type="text"
            value={config.whatsappCtaText}
            onChange={(e) => updateField("whatsappCtaText", e.target.value)}
            placeholder="Conversarlo por WhatsApp"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Pregunta Principal"
            multiline
            value={config.title}
            onChange={(e) => updateField("title", e.target.value)}
            rows={2}
            placeholder="¿Ya imaginas cómo podría sentirse tu próximo viaje?"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Subtítulo Descriptivo"
            multiline
            value={config.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            rows={2}
            placeholder="No necesitas tener todo decidido..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Mensaje Prellenado de WhatsApp"
            multiline
            value={config.whatsappMessageTemplate || ""}
            onChange={(e) => updateField("whatsappMessageTemplate", e.target.value)}
            rows={2}
            placeholder="Hola Viajes Carolina, quiero contarles qué tengo en mente para mi próximo viaje."
          />
        </div>

        <div>
          <FormField
            label="Texto Superior del Panel de Cuotas"
            type="text"
            value={config.financingEyebrowText}
            onChange={(e) => updateField("financingEyebrowText", e.target.value)}
            placeholder="VIAJA AHORA, PAGA A TU RITMO"
            required
          />
        </div>

        <div>
          <FormField
            label="Número de Cuotas"
            type="number"
            value={config.financingInstallmentsCount}
            onChange={(e) => updateField("financingInstallmentsCount", Number(e.target.value))}
            min="1"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Bancos Participantes (separados por coma)"
            type="text"
            value={financingBanksText}
            onChange={(e) => setFinancingBanksText(e.target.value)}
            placeholder="BCP, Interbank, BBVA, BanBif, Scotiabank"
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Texto Legal / Disclaimer"
            multiline
            value={config.financingDisclaimerText}
            onChange={(e) => updateField("financingDisclaimerText", e.target.value)}
            rows={2}
            placeholder="Válido con tarjetas participantes. Sujeto a condiciones de cada entidad financiera."
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
