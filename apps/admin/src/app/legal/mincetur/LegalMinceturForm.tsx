"use client";

import React from "react";
import Link from "next/link";
import type { LegalMinceturDTO } from "@vc/api-client";
import { FormCard, FormField, FormFeedback, FormSkeleton, LegalSectionsEditor } from "@vc/ui";
import { useAdminLegalMincetur } from "../../../hooks/useAdminLegalMincetur";

interface LegalMinceturFormProps {
  initialConfig?: LegalMinceturDTO;
}

export function LegalMinceturForm({ initialConfig }: LegalMinceturFormProps) {
  const { config, loading, saving, error, feedback, updateField, updateSection, addSection, removeSection, saveConfig } =
    useAdminLegalMincetur(initialConfig);

  if (loading) {
    return <FormSkeleton fields={8} className="max-w-4xl" />;
  }

  if (!config) {
    return <FormFeedback feedback={{ tone: "error", message: error || "No se pudo cargar la Constancia MINCETUR." }} />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveConfig();
  };

  return (
    <FormCard
      title="Constancia MINCETUR"
      description="Ruta pública: /constancia-mincetur"
      feedback={feedback}
      onSubmit={handleSubmit}
      saving={saving}
      submitLabel="Guardar Constancia MINCETUR"
    >
      <p className="rounded-[10px] border border-brand-navy/15 bg-brand-navy/[0.04] p-4 text-[13px] leading-[1.55] text-neutral-ink">
        La razón social, el RUC, el enlace a la constancia oficial, el N.° de registro MINCETUR y la ubicación
        registrada se editan en{" "}
        <Link href="/identidad/legal" className="font-semibold text-brand-accent underline">
          Identidad &amp; WhatsApp → Información Legal
        </Link>
        , no en este formulario.
      </p>

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

      <div className="space-y-4 rounded-[10px] border border-admin-divider bg-admin-field p-4">
        <h3 className="font-inter text-[11px] font-bold uppercase tracking-[0.55px] text-admin-label">
          Bloque de verificación MINCETUR
        </h3>
        <FormField
          label="Eyebrow del bloque de verificación"
          type="text"
          value={config.verificationEyebrow}
          onChange={(e) => updateField("verificationEyebrow", e.target.value)}
        />
        <FormField
          label="Texto del botón de verificación"
          type="text"
          value={config.verificationButtonLabel}
          onChange={(e) => updateField("verificationButtonLabel", e.target.value)}
        />
        <FormField
          label="Nota debajo del bloque de verificación"
          multiline
          rows={2}
          value={config.verificationNote}
          onChange={(e) => updateField("verificationNote", e.target.value)}
        />
      </div>

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
