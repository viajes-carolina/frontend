"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { FormCard, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface MarcaFormProps {
  initialSettings: SiteSettingsDTO;
}

export function MarcaForm({ initialSettings }: MarcaFormProps) {
  const { settings, isSaving, feedback, updateField, handleSave } = useAdminSettings(initialSettings);

  return (
    <FormCard
      title="Identidad de Marca"
      description="Nombre y lema que se muestran en el encabezado, el pie y los metadatos del sitio público."
      feedback={feedback}
      onSubmit={handleSave}
      saving={isSaving}
      submitLabel="Guardar Identidad de Marca"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Nombre de la Agencia"
          type="text"
          value={settings.siteName}
          onChange={(e) => updateField("siteName", e.target.value)}
          required
        />
        <FormField
          label="Lema / Tagline"
          type="text"
          value={settings.brandTagline}
          onChange={(e) => updateField("brandTagline", e.target.value)}
        />
      </div>
    </FormCard>
  );
}
