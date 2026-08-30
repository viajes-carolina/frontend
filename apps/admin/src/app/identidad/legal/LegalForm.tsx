"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface LegalFormProps {
  initialSettings: SiteSettingsDTO;
}

export function LegalForm({ initialSettings }: LegalFormProps) {
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
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy border-b border-neutral-border pb-3">
            Información Legal
          </h2>
          <p className="text-xs text-neutral-muted mt-2">
            Se muestra en el Libro de Reclamaciones Virtual, exigido por la Ley N° 29571.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <FormField
              label="Razón Social"
              type="text"
              value={settings.legalCompanyName || ""}
              onChange={(e) => updateField("legalCompanyName", e.target.value)}
              placeholder="VIAJES CAROLINA S.A.C."
              required
            />
          </div>

          <div>
            <FormField
              label="RUC"
              type="text"
              value={settings.taxId || ""}
              onChange={(e) => updateField("taxId", e.target.value)}
              placeholder="20601234567"
              required
            />
          </div>
        </div>

        <div>
          <FormField
            label="Enlace a Constancia MINCETUR (opcional)"
            type="url"
            value={settings.minceturCertificateUrl || ""}
            onChange={(e) => updateField("minceturCertificateUrl", e.target.value)}
            placeholder="https://..."
          />
          <span className="text-xs text-neutral-muted mt-1 block">
            Se muestra como botón en la página pública /constancia-mincetur. Si se deja vacío, la página muestra el
            resto del contenido sin el botón.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <FormField
              label="N.° de registro MINCETUR"
              type="text"
              value={settings.minceturRegistrationNumber || ""}
              onChange={(e) => updateField("minceturRegistrationNumber", e.target.value)}
              placeholder="RNT N.° 012345"
            />
          </div>

          <div>
            <FormField
              label="Ubicación registrada"
              type="text"
              value={settings.minceturLocation || ""}
              onChange={(e) => updateField("minceturLocation", e.target.value)}
              placeholder="Lima, Perú"
            />
          </div>
        </div>
        <span className="text-xs text-neutral-muted -mt-4 block">
          Ambos campos se muestran en el bloque de verificación de la página pública /constancia-mincetur.
        </span>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={isSaving}>
            Guardar Información Legal
          </Button>
        </div>
      </div>
    </>
  );
}
