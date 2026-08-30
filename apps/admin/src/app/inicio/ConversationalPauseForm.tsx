"use client";

import React from "react";
import type { HomeConversationalPauseDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
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
    feedback,
    updateField,
    financingBanksText,
    setFinancingBanksText,
    saveConfig,
  } = useAdminConversationalPause(initialConfig);

  if (loading) {
    return <FormSkeleton fields={9} className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{
          tone: "error",
          message: error || "No se pudo cargar la configuración de Pausa Conversacional.",
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
      title="Pausa Conversacional (sección 04, entre Blog y Experiencias)"
      description="Bloque de solo-CTA: una pregunta y un botón de WhatsApp, sin tarjetas ni fotos."
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
          placeholder="04 · Antes de seguir"
          required
        />

        <FormField
          label="Texto del Botón de WhatsApp"
          type="text"
          value={config.whatsappCtaText}
          onChange={(e) => updateField("whatsappCtaText", e.target.value)}
          placeholder="Conversarlo por WhatsApp"
          required
        />

        <FormField
          label="Pregunta Principal"
          multiline
          rows={2}
          value={config.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="¿Ya imaginas cómo podría sentirse tu próximo viaje?"
          required
          wrapperClassName="md:col-span-2"
        />

        <FormField
          label="Subtítulo Descriptivo"
          multiline
          rows={2}
          value={config.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          placeholder="No necesitas tener todo decidido..."
          required
          wrapperClassName="md:col-span-2"
        />

        <FormField
          label="Mensaje Prellenado de WhatsApp"
          multiline
          rows={2}
          value={config.whatsappMessageTemplate || ""}
          onChange={(e) => updateField("whatsappMessageTemplate", e.target.value)}
          placeholder="Hola Viajes Carolina, quiero contarles qué tengo en mente para mi próximo viaje."
          wrapperClassName="md:col-span-2"
        />

        <FormField
          label="Texto Superior del Panel de Cuotas"
          type="text"
          value={config.financingEyebrowText}
          onChange={(e) => updateField("financingEyebrowText", e.target.value)}
          placeholder="VIAJA AHORA, PAGA A TU RITMO"
          required
        />

        <FormField
          label="Número de Cuotas"
          type="number"
          value={config.financingInstallmentsCount}
          onChange={(e) => updateField("financingInstallmentsCount", Number(e.target.value))}
          min="1"
          required
        />

        <FormField
          label="Bancos Participantes (separados por coma)"
          type="text"
          value={financingBanksText}
          onChange={(e) => setFinancingBanksText(e.target.value)}
          placeholder="BCP, Interbank, BBVA, BanBif, Scotiabank"
          wrapperClassName="md:col-span-2"
        />

        <FormField
          label="Texto Legal / Disclaimer"
          multiline
          rows={2}
          value={config.financingDisclaimerText}
          onChange={(e) => updateField("financingDisclaimerText", e.target.value)}
          placeholder="Válido con tarjetas participantes. Sujeto a condiciones de cada entidad financiera."
          wrapperClassName="md:col-span-2"
        />
      </div>
    </FormCard>
  );
};
