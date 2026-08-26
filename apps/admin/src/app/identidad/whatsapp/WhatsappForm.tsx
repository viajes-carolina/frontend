"use client";

import React from "react";
import type { SiteSettingsDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";
import { useAdminSettings } from "../../../hooks/useAdminSettings";

export interface WhatsappFormProps {
  initialSettings: SiteSettingsDTO;
}

export function WhatsappForm({ initialSettings }: WhatsappFormProps) {
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
          Canal WhatsApp (Fuente Única de Contacto)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <FormField
              label="Número E.164 (wa.me)"
              type="text"
              value={settings.whatsappPhone}
              onChange={(e) => updateField("whatsappPhone", e.target.value)}
              placeholder="+51987654321"
              required
            />
            <span className="text-xs text-neutral-muted mt-1 block">
              Formato internacional con signo + y código de país, sin espacios (para enlaces wa.me).
            </span>
          </div>

          <div>
            <FormField
              label="Número para Mostrar"
              type="text"
              value={settings.whatsappDisplayNumber}
              onChange={(e) => updateField("whatsappDisplayNumber", e.target.value)}
              placeholder="+51 987 654 321"
              required
            />
            <span className="text-xs text-neutral-muted mt-1 block">
              Formato legible con espacios, usado en el sitio (footer, header, contacto).
            </span>
          </div>
        </div>

        <div>
          <FormField
            label="Correo Electrónico Oficial"
            type="email"
            value={settings.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
            required
          />
        </div>

        <div>
          <FormField
            label="Mensaje Predeterminado de WhatsApp"
            multiline
            rows={2}
            value={settings.whatsappDefaultMessage}
            onChange={(e) => updateField("whatsappDefaultMessage", e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={() => handleSave()} disabled={isSaving}>
            Guardar Canal WhatsApp
          </Button>
        </div>
      </div>
    </>
  );
}
