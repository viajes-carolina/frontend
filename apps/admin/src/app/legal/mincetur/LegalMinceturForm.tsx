"use client";

import React from "react";
import Link from "next/link";
import type { LegalMinceturDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField, FormSkeleton, LegalSectionsEditor } from "@vc/ui";
import { useAdminLegalMincetur } from "../../../hooks/useAdminLegalMincetur";

interface LegalMinceturFormProps {
  initialConfig?: LegalMinceturDTO;
}

export function LegalMinceturForm({ initialConfig }: LegalMinceturFormProps) {
  const { config, loading, saving, error, success, updateField, updateSection, addSection, removeSection, saveConfig } =
    useAdminLegalMincetur(initialConfig);

  if (loading) {
    return <FormSkeleton fields={8} />;
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
        No se pudo cargar la Constancia MINCETUR.
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
        <h2 className="text-xl font-bold text-brand-navy">Constancia MINCETUR</h2>
        <p className="text-xs text-neutral-muted mt-1">Ruta pública: /constancia-mincetur</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckIcon size={18} className="text-emerald-600 shrink-0" />
          Cambios guardados correctamente.
        </div>
      )}

      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-sm">
        La razón social, el RUC, el enlace a la constancia oficial, el N.° de registro MINCETUR y la ubicación
        registrada se editan en{" "}
        <Link href="/identidad/legal" className="font-semibold underline hover:text-sky-700">
          Identidad &amp; WhatsApp → Información Legal
        </Link>
        , no en este formulario.
      </div>

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

      <div className="space-y-4 rounded-xl border border-neutral-border bg-neutral-soft p-4">
        <label className="block text-xs font-bold text-neutral-muted uppercase tracking-wider">
          Bloque de verificación MINCETUR
        </label>
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
          {saving ? "Guardando..." : "Guardar Constancia MINCETUR"}
        </Button>
      </div>
    </form>
  );
}
