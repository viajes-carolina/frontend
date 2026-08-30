"use client";

import React from "react";
import type { LegalTermsDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton, LegalSectionsEditor } from "@vc/ui";
import { useAdminLegalTerminos } from "../../../hooks/useAdminLegalTerminos";

interface LegalTerminosFormProps {
  initialConfig?: LegalTermsDTO;
}

export function LegalTerminosForm({ initialConfig }: LegalTerminosFormProps) {
  const { config, loading, saving, error, feedback, updateField, updateSection, addSection, removeSection, saveConfig } =
    useAdminLegalTerminos(initialConfig);

  if (loading) {
    return <FormSkeleton fields={6} className="max-w-4xl" />;
  }

  if (!config) {
    return (
      <FormFeedback
        feedback={{ tone: "error", message: error || "No se pudo cargar los términos y condiciones." }}
      />
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConfig();
  };

  return (
    <FormCard
      title="Términos y condiciones"
      description="Ruta pública: /terminos"
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Términos y condiciones"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Eyebrow"
          type="text"
          value={config.eyebrow}
          onChange={(e) => updateField("eyebrow", e.target.value)}
          required
        />
        <FormField
          label="Título"
          type="text"
          value={config.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
        <FormField
          label="Etiqueta de control de documento"
          type="text"
          value={config.documentControlLabel}
          onChange={(e) => updateField("documentControlLabel", e.target.value)}
          placeholder="Última actualización"
        />
        <FormField
          label="Valor de control de documento"
          type="text"
          value={config.documentControlText}
          onChange={(e) => updateField("documentControlText", e.target.value)}
          placeholder="agosto de 2026"
        />
      </div>

      <FormField
        label="Introducción"
        multiline
        rows={3}
        value={config.introduction}
        onChange={(e) => updateField("introduction", e.target.value)}
      />

      <LegalSectionsEditor
        sections={config.sections}
        onUpdate={updateSection}
        onAdd={addSection}
        onRemove={removeSection}
      />

      <div className="space-y-4 border-t border-admin-divider pt-6">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Cierre de la página
        </h3>
        <FormField
          label="Título de cierre"
          type="text"
          value={config.closingTitle}
          onChange={(e) => updateField("closingTitle", e.target.value)}
        />
        <FormField
          label="Texto de cierre"
          multiline
          rows={2}
          value={config.closingBody}
          onChange={(e) => updateField("closingBody", e.target.value)}
        />
        <FormField
          label="Texto del botón de WhatsApp"
          type="text"
          value={config.closingLinkLabel}
          onChange={(e) => updateField("closingLinkLabel", e.target.value)}
        />
      </div>
    </FormCard>
  );
}
