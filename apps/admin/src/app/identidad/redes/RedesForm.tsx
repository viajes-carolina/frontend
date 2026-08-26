"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface RedesFormProps {
  initialSettings: SiteSettingsDTO;
}

export function RedesForm({ initialSettings }: RedesFormProps) {
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
          Redes Sociales Oficiales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <FormField
              label="Instagram"
              type="url"
              value={settings.instagramUrl || ""}
              onChange={(e) => updateField("instagramUrl", e.target.value)}
            />
          </div>

          <div>
            <FormField
              label="Facebook"
              type="url"
              value={settings.facebookUrl || ""}
              onChange={(e) => updateField("facebookUrl", e.target.value)}
            />
          </div>

          <div>
            <FormField
              label="TikTok"
              type="url"
              value={settings.tiktokUrl || ""}
              onChange={(e) => updateField("tiktokUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={isSaving}>
            Guardar Redes Sociales
          </Button>
        </div>
      </div>
    </>
  );
}
