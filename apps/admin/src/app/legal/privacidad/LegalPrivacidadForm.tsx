"use client";

import React from "react";
import type { LegalPrivacyDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField, FormSkeleton, LegalSectionsEditor } from "@vc/ui";
import { useAdminLegalPrivacidad } from "../../../hooks/useAdminLegalPrivacidad";

interface LegalPrivacidadFormProps {
  initialConfig?: LegalPrivacyDTO;
}

export function LegalPrivacidadForm({ initialConfig }: LegalPrivacidadFormProps) {
  const { config, loading, saving, error, success, updateField, updateSection, addSection, removeSection, saveConfig } =
    useAdminLegalPrivacidad(initialConfig);

  if (loading) {
    return <FormSkeleton fields={6} />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la política de privacidad.
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-neutral-border shadow-sm space-y-6 max-w-4xl">
      <div className="border-b border-neutral-border pb-4">
        <h2 className="text-xl font-bold text-brand-navy">Política de privacidad</h2>
        <p className="text-xs text-neutral-muted mt-1">Ruta pública: /privacidad</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckIcon size={18} className="text-emerald-600 shrink-0" />
          Cambios guardados correctamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField label="Eyebrow" type="text" value={config.eyebrow} onChange={(e) => updateField("eyebrow", e.target.value)} required />
        </div>
        <div>
          <FormField label="Título" type="text" value={config.title} onChange={(e) => updateField("title", e.target.value)} required />
        </div>
        <div>
          <FormField
            label="Etiqueta de control de documento"
            type="text"
            value={config.documentControlLabel}
            onChange={(e) => updateField("documentControlLabel", e.target.value)}
            placeholder="Última actualización"
          />
        </div>
        <div>
          <FormField
            label="Valor de control de documento"
            type="text"
            value={config.documentControlText}
            onChange={(e) => updateField("documentControlText", e.target.value)}
            placeholder="agosto de 2026"
          />
        </div>
      </div>

      <div>
        <FormField
          label="Introducción"
          multiline
          rows={3}
          value={config.introduction}
          onChange={(e) => updateField("introduction", e.target.value)}
        />
      </div>

      <LegalSectionsEditor
        sections={config.sections}
        onUpdate={updateSection}
        onAdd={addSection}
        onRemove={removeSection}
      />

      <div className="space-y-4 border-t border-neutral-border pt-6">
        <label className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">Cierre de la página</label>
        <FormField label="Título de cierre" type="text" value={config.closingTitle} onChange={(e) => updateField("closingTitle", e.target.value)} />
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

      <div className="flex justify-end pt-4 border-t border-neutral-border">
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Política de privacidad"}
        </Button>
      </div>
    </form>
  );
}
