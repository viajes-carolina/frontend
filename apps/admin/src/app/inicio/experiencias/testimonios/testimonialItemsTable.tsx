"use client";

import React from "react";
import type { TestimonialDTO } from "@vc/api-client";
import { Badge, StarIcon } from "@vc/ui";
import {
  TableRowActions,
  TableTitle,
  type DataTableColumn,
  type DataTableFilterDefinition,
} from "../../../../components/table";
import { MediaThumb } from "../../../../components/MediaThumb";

/* ==========================================================================
   Declaración de la tabla de Testimonios de la portada.
   ========================================================================== */

export const searchInTestimonial = (t: TestimonialDTO) => [
  t.clientName,
  t.clientLocation,
  t.tripDestination,
  t.comment,
];

const STATUS_FILTER: DataTableFilterDefinition<TestimonialDTO> = {
  id: "status",
  label: "Estado",
  options: [
    { value: "ALL", label: "Todos" },
    { value: "ACTIVE", label: "Activos" },
    { value: "INACTIVE", label: "Inactivos" },
  ],
  match: (t, value) => (value === "ACTIVE" ? t.active : !t.active),
};

const RATING_FILTER: DataTableFilterDefinition<TestimonialDTO> = {
  id: "rating",
  label: "Calificación",
  options: [
    { value: "ALL", label: "Todas" },
    { value: "5", label: "5 estrellas" },
    { value: "4", label: "4 o menos" },
  ],
  /* "4 o menos" y no "4 exactas": lo que se busca en esta tabla es el
     testimonio que baja la media, no el que tiene un número concreto. */
  match: (t, value) => (value === "5" ? (t.rating || 5) === 5 : (t.rating || 5) <= 4),
};

export const TESTIMONIAL_FILTERS = [STATUS_FILTER, RATING_FILTER];

export interface TestimonialColumnHandlers {
  onEdit: (testimonial: TestimonialDTO) => void;
  onDeactivate: (testimonial: TestimonialDTO) => void;
}

export function buildTestimonialColumns({
  onEdit,
  onDeactivate,
}: TestimonialColumnHandlers): readonly DataTableColumn<TestimonialDTO>[] {
  return [
    {
      id: "client",
      header: "Cliente",
      width: "min-w-[220px]",
      cell: (t) => (
        <div className="flex items-center gap-3">
          <MediaThumb
            url={t.avatarMediaUrl}
            alt={t.clientName}
            sizes="36px"
            iconSize={14}
            className="h-9 w-9 shrink-0 rounded-full border border-neutral-border"
            empty={<span className="text-[11px] font-bold text-brand-navy">{t.clientName.charAt(0)}</span>}
          />
          <TableTitle title={t.clientName} meta={t.clientLocation || "Perú"} clamp={1} />
        </div>
      ),
    },
    {
      id: "trip",
      header: "Viaje / destino",
      width: "w-[160px]",
      cell: (t) => (
        <span className="font-inter text-[10px] font-medium leading-[1.4] text-brand-navy">
          {t.tripDestination}
        </span>
      ),
    },
    {
      id: "rating",
      header: "Calificación",
      width: "w-[110px]",
      cell: (t) => (
        /* Las estrellas son un dibujo: el valor va escrito en el nombre
           accesible para quien no las ve. */
        <span
          role="img"
          aria-label={`${t.rating || 5} de 5 estrellas`}
          className="flex items-center gap-0.5 text-brand-accent"
        >
          {Array.from({ length: t.rating || 5 }).map((_, i) => (
            <StarIcon key={i} size={12} aria-hidden="true" />
          ))}
        </span>
      ),
    },
    {
      id: "comment",
      header: "Comentario",
      width: "min-w-[260px]",
      cell: (t) => (
        <span className="line-clamp-2 font-inter text-[10px] italic leading-[1.5] text-neutral-quiet-ink">
          &ldquo;{t.comment}&rdquo;
        </span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      width: "w-[110px]",
      /* Visible en el sitio = éxito; retirado = neutro. */
      cell: (t) => (
        <Badge tone={t.active ? "success" : "neutral"}>{t.active ? "Activo" : "Inactivo"}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      headerHidden: true,
      align: "end",
      width: "w-[64px]",
      cell: (t) => (
        <TableRowActions
          label={`Acciones del testimonio de "${t.clientName}"`}
          actions={[
            { id: "edit", label: "Editar", onSelect: () => onEdit(t) },
            {
              id: "deactivate",
              label: "Desactivar",
              tone: "danger",
              disabled: !t.active,
              onSelect: () => onDeactivate(t),
            },
          ]}
        />
      ),
    },
  ];
}
