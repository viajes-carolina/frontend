"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { HomeHeroDTO } from "@vc/api-client";
import { Button, CheckIcon, Disclosure, FormField } from "@vc/ui";
import { useAdminHomeHero } from "../../../../hooks/useAdminHomeHero";

export interface ConfianzaFormProps {
  initialHero: HomeHeroDTO;
}

export function ConfianzaForm({ initialHero }: ConfianzaFormProps) {
  const router = useRouter();
  const {
    trustIndicators, setTrustIndicators,
    trustStatText, setTrustStatText,
    isSaving,
    statusMessage,
    handleSave,
  } = useAdminHomeHero(initialHero);

  const updateTrustIndicator = (index: number, value: string) => {
    const updated = [...trustIndicators];
    updated[index] = value;
    setTrustIndicators(updated);
  };

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
          <h2 className="font-sora font-bold text-lg text-brand-navy">3. Línea de Confianza</h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Frase con ícono de corazón mostrada bajo el botón de WhatsApp del Hero.
          </p>
        </div>

        <div>
          <FormField
            label="Texto de confianza (con cifra real, no inventada)"
            type="text"
            value={trustStatText}
            onChange={(e) => setTrustStatText(e.target.value)}
            placeholder="Ej: Más de 1,000 viajeros han confiado en nosotros para vivir recuerdos inolvidables."
          />
        </div>

        <Disclosure summary="Campos heredados (sin uso actual en el Hero)">
          <p className="font-inter text-xs text-neutral-muted mb-3">
            Los 3 pilares de abajo (Asesoría sin costo, etc.) quedan guardados pero no se muestran en el Hero
            actual — se usaban en un diseño anterior. Se conservan por si se necesitan en otra sección.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                <FormField
                  label={`Pilar #${idx + 1}`}
                  type="text"
                  value={trustIndicators[idx] || ""}
                  onChange={(e) => updateTrustIndicator(idx, e.target.value)}
                  placeholder={`Pilar ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </Disclosure>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={handleSaveAndRefresh} disabled={isSaving}>
            Guardar Línea de Confianza
          </Button>
        </div>
      </div>
    </>
  );
}
