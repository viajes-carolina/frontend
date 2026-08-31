"use client";

import React from "react";
import type { AccompanyStepDTO } from "@vc/api-client";
import { FormCard, FormField, FormSkeleton, type FormFeedbackState } from "@vc/ui";

/** Enlaza la tarjeta con el botón de la barra persistente, que vive fuera del `<form>`. */
export const TEAM_HEADER_FORM_ID = "team-header-form";

export interface AdvisorsHighlightsCardProps {
  badge: string;
  highlights: AccompanyStepDTO[];
  loading: boolean;
  saving: boolean;
  feedback: FormFeedbackState | null;
  onChangeBadge: (value: string) => void;
  onChangeHighlight: (index: number, field: keyof AccompanyStepDTO, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Columna izquierda: encabezado editorial de la sección "Quién está detrás"
 * (badge + las 2 "voces de apoyo" que acompañan a la asesora protagonista).
 *
 * Vive en el mismo `about_page` que el resto de Nosotros, así que su estado lo
 * gobierna `useAdminAbout` — el mismo hook de `/nosotros/cabecera` y
 * `/nosotros/forma-de-trabajo`. Aquí llega ya resuelto por props y no llamando
 * al hook: la barra de acciones persistente de la pantalla necesita el mismo
 * `isDirty`/`saving`, y dos llamadas al hook serían dos cargas y dos estados
 * que se contradicen.
 */
export function AdvisorsHighlightsCard({
  badge,
  highlights,
  loading,
  saving,
  feedback,
  onChangeBadge,
  onChangeHighlight,
  onSubmit,
}: AdvisorsHighlightsCardProps) {
  if (loading) {
    return <FormSkeleton fields={3} />;
  }

  return (
    <FormCard
      id={TEAM_HEADER_FORM_ID}
      title="Quién está detrás"
      description="Define el encabezado y los mensajes de apoyo que acompañan a la asesora protagonista."
      feedback={feedback}
      onSubmit={onSubmit}
      saving={saving}
      submitLabel="Guardar encabezado del equipo"
      /* El guardado vive en la barra persistente del pie de la pantalla, que
         lo envía por `form="…"`. Sin ocultar este pie, el mismo botón salía
         dos veces — contra la regla "una acción principal por bloque". */
      hideFooter
      className="max-w-none"
    >
      <FormField
        label="Badge / Distintivo"
        type="text"
        value={badge}
        onChange={(event) => onChangeBadge(event.target.value)}
        placeholder="03 · QUIÉN ESTÁ DETRÁS"
      />

      <div className="space-y-3">
        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.5px] text-admin-label">
          Voces de apoyo
        </p>

        {highlights.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-[8px] border border-divider-soft bg-admin-field p-[14px]"
          >
            <p className="font-inter text-[9px] font-bold uppercase tracking-[0.45px] text-brand-accent">
              {`Voz ${String(index + 1).padStart(2, "0")}`}
            </p>
            <FormField
              label="Título"
              type="text"
              density="compact"
              value={item.title}
              onChange={(event) => onChangeHighlight(index, "title", event.target.value)}
              placeholder="Orientación personalizada"
            />
            <FormField
              label="Descripción"
              type="text"
              density="compact"
              value={item.body}
              onChange={(event) => onChangeHighlight(index, "body", event.target.value)}
              placeholder="Basada en tus fechas, presupuesto y prioridades."
            />
          </div>
        ))}
      </div>
    </FormCard>
  );
}
