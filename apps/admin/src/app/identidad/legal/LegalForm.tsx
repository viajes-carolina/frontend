"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { FormCard, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface LegalFormProps {
  initialSettings: SiteSettingsDTO;
}

export function LegalForm({ initialSettings }: LegalFormProps) {
  const { settings, isSaving, feedback, updateField, handleSave } = useAdminSettings(initialSettings);

  return (
    <FormCard
      title="Información Legal"
      description="Se muestra en el Libro de Reclamaciones Virtual, exigido por la Ley N° 29571."
      feedback={feedback}
      onSubmit={handleSave}
      saving={isSaving}
      submitLabel="Guardar Información Legal"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Razón Social"
          type="text"
          value={settings.legalCompanyName || ""}
          onChange={(e) => updateField("legalCompanyName", e.target.value)}
          placeholder="VIAJES CAROLINA S.A.C."
          required
        />
        <FormField
          label="RUC"
          type="text"
          value={settings.taxId || ""}
          onChange={(e) => updateField("taxId", e.target.value)}
          placeholder="20601234567"
          required
        />
      </div>

      <FormField
        label="Enlace a Constancia MINCETUR (opcional)"
        type="url"
        value={settings.minceturCertificateUrl || ""}
        onChange={(e) => updateField("minceturCertificateUrl", e.target.value)}
        placeholder="https://..."
        hint="Se muestra como botón en la página pública /constancia-mincetur. Si se deja vacío, la página muestra el resto del contenido sin el botón."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="N.° de registro MINCETUR"
          type="text"
          value={settings.minceturRegistrationNumber || ""}
          onChange={(e) => updateField("minceturRegistrationNumber", e.target.value)}
          placeholder="RNT N.° 012345"
        />
        <FormField
          label="Ubicación registrada"
          type="text"
          value={settings.minceturLocation || ""}
          onChange={(e) => updateField("minceturLocation", e.target.value)}
          placeholder="Lima, Perú"
          hint="Este campo y el N.° de registro se muestran en el bloque de verificación de /constancia-mincetur."
        />
      </div>
    </FormCard>
  );
}
