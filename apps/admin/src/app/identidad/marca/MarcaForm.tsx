"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface MarcaFormProps {
  initialSettings: SiteSettingsDTO;
}

export function MarcaForm({ initialSettings }: MarcaFormProps) {
  const { settings, isSaving, saveSuccess, updateField, handleSave } = useAdminSettings(initialSettings);

  return (
    <>
      {saveSuccess && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">Cambios guardados correctamente y sincronizados con la web pública.</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm space-y-6 max-w-4xl">
        <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
          Identidad de Marca
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <FormField
              label="Nombre de la Agencia"
              type="text"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
              required
            />
          </div>

          <div>
            <FormField
              label="Lema / Tagline"
              type="text"
              value={settings.brandTagline}
              onChange={(e) => updateField("brandTagline", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={isSaving}>
            Guardar Identidad de Marca
          </Button>
        </div>
      </div>
    </>
  );
}
