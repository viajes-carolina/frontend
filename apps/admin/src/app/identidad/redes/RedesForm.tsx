"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { FormCard, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface RedesFormProps {
  initialSettings: SiteSettingsDTO;
}

export function RedesForm({ initialSettings }: RedesFormProps) {
  const { settings, isSaving, feedback, updateField, handleSave } = useAdminSettings(initialSettings);

  return (
    <FormCard
      title="Redes Sociales Oficiales"
      description="Enlaces que se muestran en el pie del sitio público. Deja en blanco los que no se usen."
      feedback={feedback}
      onSubmit={handleSave}
      saving={isSaving}
      submitLabel="Guardar Redes Sociales"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FormField
          label="Instagram"
          type="url"
          value={settings.instagramUrl || ""}
          onChange={(e) => updateField("instagramUrl", e.target.value)}
        />
        <FormField
          label="Facebook"
          type="url"
          value={settings.facebookUrl || ""}
          onChange={(e) => updateField("facebookUrl", e.target.value)}
        />
        <FormField
          label="TikTok"
          type="url"
          value={settings.tiktokUrl || ""}
          onChange={(e) => updateField("tiktokUrl", e.target.value)}
        />
      </div>
    </FormCard>
  );
}
