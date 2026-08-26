"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { HomeHeroDTO } from "@vc/api-client";
import { Button, CheckIcon, FormField } from "@vc/ui";
import { useAdminHomeHero } from "../../../../hooks/useAdminHomeHero";

export interface TitularesFormProps {
  initialHero: HomeHeroDTO;
}

export function TitularesForm({ initialHero }: TitularesFormProps) {
  const router = useRouter();
  const {
    eyebrowText, setEyebrowText,
    titleHighlight, setTitleHighlight,
    titleAccent, setTitleAccent,
    description, setDescription,
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
            1. Titulares & Mensaje Principal (Hero Display)
          </h2>
          <p className="font-inter text-xs text-neutral-muted mt-1">
            Configura la primera impresión que recibirán los viajeros al ingresar a la web.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <FormField
              label="Insignia Superior (Pill Eyebrow)"
              type="text"
              value={eyebrowText}
              onChange={(e) => setEyebrowText(e.target.value)}
              placeholder="Ej: Empieza con una conversación"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormField
                label="Título Principal (Blanco)"
                type="text"
                value={titleHighlight}
                onChange={(e) => setTitleHighlight(e.target.value)}
                placeholder="Ej: Tu viaje comienza"
                required
              />
            </div>
            <div>
              <FormField
                label="Texto de Acento (Naranja Sunset)"
                type="text"
                value={titleAccent}
                onChange={(e) => setTitleAccent(e.target.value)}
                placeholder="Ej: antes de despegar"
                required
              />
            </div>
          </div>

          <div>
            <FormField
              label="Descripción de Acompañamiento"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Desde la primera idea hasta tu regreso, una asesora te acompaña..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-border">
          <Button variant="primary" type="button" onClick={handleSaveAndRefresh} disabled={isSaving}>
            Guardar Titulares
          </Button>
        </div>
      </div>
    </>
  );
}
