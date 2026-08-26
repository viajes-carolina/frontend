"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { HomeHeroDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";
import { useAdminHomeHero } from "../../../../hooks/useAdminHomeHero";

export interface BotonesFormProps {
  initialHero: HomeHeroDTO;
}

export function BotonesForm({ initialHero }: BotonesFormProps) {
  const router = useRouter();
  const {
    whatsappCtaText, setWhatsappCtaText,
    whatsappMessageOverride, setWhatsappMessageOverride,
    secondaryCtaText, setSecondaryCtaText,
    secondaryCtaUrl, setSecondaryCtaUrl,
    isSaving,
    statusMessage,
    handleSave,
  } = useAdminHomeHero(initialHero);

  const handleSaveAndRefresh = async () => {
    await handleSave();
    router.refresh();
  };

  return (
    <>
      {statusMessage && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
          <CheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">{statusMessage}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-border shadow-sm space-y-6 max-w-4xl">
        <div>
          <h2 className="font-sora font-bold text-lg text-brand-navy">
            2. Botones de Acción & Conversación
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Personaliza el texto del botón principal de WhatsApp y el botón secundario de exploración.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Texto del Botón WhatsApp"
              type="text"
              value={whatsappCtaText}
              onChange={(e) => setWhatsappCtaText(e.target.value)}
              placeholder="Ej: Cuéntame tu viaje"
              required
            />
          </div>
          <div>
            <FormField
              label="Mensaje Predefinido para WhatsApp"
              type="text"
              value={whatsappMessageOverride}
              onChange={(e) => setWhatsappMessageOverride(e.target.value)}
              placeholder="Ej: Hola Viajes Carolina, quiero empezar a planear mi próximo viaje."
            />
          </div>
          <div>
            <FormField
              label="Texto Botón Secundario (Opcional)"
              type="text"
              value={secondaryCtaText}
              onChange={(e) => setSecondaryCtaText(e.target.value)}
              placeholder="Ej: Explorar promociones"
            />
          </div>
          <div>
            <FormField
              label="Enlace Botón Secundario (URL o Ancla)"
              type="text"
              value={secondaryCtaUrl}
              onChange={(e) => setSecondaryCtaUrl(e.target.value)}
              placeholder="Ej: #promociones o /promociones"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={handleSaveAndRefresh} disabled={isSaving}>
            Guardar Botones
          </Button>
        </div>
      </div>
    </>
  );
}
