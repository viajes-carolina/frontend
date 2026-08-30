"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { FormCard, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface WhatsappFormProps {
  initialSettings: SiteSettingsDTO;
}

export function WhatsappForm({ initialSettings }: WhatsappFormProps) {
  const { settings, isSaving, feedback, updateField, handleSave } = useAdminSettings(initialSettings);

  return (
    <FormCard
      title="Canal WhatsApp (Fuente Única de Contacto)"
      description="Número, correo y mensaje predeterminado que alimentan todos los enlaces de contacto del sitio."
      feedback={feedback}
      onSubmit={handleSave}
      saving={isSaving}
      submitLabel="Guardar Canal WhatsApp"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Número E.164 (wa.me)"
          type="text"
          value={settings.whatsappPhone}
          onChange={(e) => updateField("whatsappPhone", e.target.value)}
          placeholder="+51987654321"
          required
          hint="Formato internacional con signo + y código de país, sin espacios (para enlaces wa.me)."
        />
        <FormField
          label="Número para Mostrar"
          type="text"
          value={settings.whatsappDisplayNumber}
          onChange={(e) => updateField("whatsappDisplayNumber", e.target.value)}
          placeholder="+51 987 654 321"
          required
          hint="Formato legible con espacios, usado en el sitio (footer, header, contacto)."
        />
      </div>

      <FormField
        label="Correo Electrónico Oficial"
        type="email"
        value={settings.contactEmail}
        onChange={(e) => updateField("contactEmail", e.target.value)}
        required
      />

      <FormField
        label="Mensaje Predeterminado de WhatsApp"
        multiline
        rows={2}
        value={settings.whatsappDefaultMessage}
        onChange={(e) => updateField("whatsappDefaultMessage", e.target.value)}
      />
    </FormCard>
  );
}
