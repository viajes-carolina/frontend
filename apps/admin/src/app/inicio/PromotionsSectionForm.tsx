"use client";

import React from "react";
import type { HomePromotionsSectionDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton } from "@vc/ui";
import { useAdminPromotionsSection } from "../../hooks/useAdminPromotionsSection";

interface PromotionsSectionFormProps {
  initialConfig?: HomePromotionsSectionDTO;
}

export const PromotionsSectionForm: React.FC<PromotionsSectionFormProps> = ({ initialConfig }) => {
  const { config, loading, saving, error, feedback, updateField, saveConfig } =
    useAdminPromotionsSection(initialConfig);

  if (loading) {
    return <FormSkeleton fields={8} className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{
          tone: "error",
          message: error || "No se pudo cargar la configuración de la sección de Promociones.",
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
      title="Encabezado de Promociones (sección 02)"
      description={
        <>
          Título y descripción de la sección, más el cierre &ldquo;Propuesta a medida&rdquo; al final de las
          tarjetas. El título, precio, foto e inclusiones de cada promoción se crean más abajo en esta misma
          página — la tarjeta protagonista y las secundarias usan la foto de cada promoción; si una promoción no
          tiene foto, se muestra un color de fondo en su lugar. Al crear una promoción se publica automáticamente
          un post en la Página de Facebook.
        </>
      }
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
        placeholder="02 · Viajes para empezar a imaginar"
        required
      />

      <FormField
        label="Título"
        type="text"
        value={config.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Algunas formas de vivir tu próximo viaje"
        required
      />

      <FormField
        label="Subtítulo"
        multiline
        rows={2}
        value={config.subtitle}
        onChange={(e) => updateField("subtitle", e.target.value)}
        placeholder="Experiencias que podemos ajustar a tus tiempos, compañía y presupuesto."
        required
      />

      <div className="space-y-6 border-t border-admin-divider pt-6">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Cierre &ldquo;Propuesta a medida&rdquo; (panel navy después de las tarjetas)
        </h3>

        <FormField
          label="Eyebrow"
          type="text"
          value={config.bottomCtaEyebrow}
          onChange={(e) => updateField("bottomCtaEyebrow", e.target.value)}
          placeholder="SI NINGUNO ENCAJA EXACTAMENTE"
          required
        />

        <FormField
          label="Título"
          type="text"
          value={config.bottomCtaQuestion}
          onChange={(e) => updateField("bottomCtaQuestion", e.target.value)}
          placeholder="Cuéntanos qué imaginas y lo armamos contigo."
          required
        />

        <FormField
          label="Copy"
          multiline
          rows={2}
          value={config.bottomCtaCopy}
          onChange={(e) => updateField("bottomCtaCopy", e.target.value)}
          placeholder="Fechas, presupuesto y tipo de viaje: una asesora prepara opciones reales para ti."
          required
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="Texto del Botón de WhatsApp"
            type="text"
            value={config.bottomCtaWhatsappText}
            onChange={(e) => updateField("bottomCtaWhatsappText", e.target.value)}
            placeholder="Cuéntanos cuál te gustó"
            required
          />

          <FormField
            label="Mensaje Prellenado de WhatsApp"
            type="text"
            value={config.bottomCtaWhatsappMessage || ""}
            onChange={(e) => updateField("bottomCtaWhatsappMessage", e.target.value)}
            placeholder="Hola Viajes Carolina, me gustaría conversar sobre una de sus promociones."
          />
        </div>
      </div>
    </FormCard>
  );
};
