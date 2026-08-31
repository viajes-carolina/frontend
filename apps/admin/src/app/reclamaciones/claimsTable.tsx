"use client";

import React from "react";
import type { ClaimRecordDTO } from "@vc/api-client";
import { Badge, type BadgeTone } from "@vc/ui";
import {
  TableRowActions,
  TableText,
  TableTitle,
  type DataTableColumn,
  type DataTableFilterDefinition,
} from "../../components/table";

/* ==========================================================================
   Declaración de la tabla del Libro de Reclamaciones.
   ========================================================================== */

/**
 * Estado del reclamo, en los tonos SEMÁNTICOS del kit — no en el color que
 * cada píldora tenía escrito a mano.
 *
 *   PENDING     danger   exige atención: un reclamo sin atender corre plazo legal.
 *   IN_PROGRESS accent   trabajo en curso, destacado sin alarmar.
 *   RESOLVED    success  caso cerrado con respuesta.
 *   REJECTED    neutral  caso cerrado sin lugar; ya no pide nada.
 *
 * La etiqueta viaja junto al tono porque "selección, visibilidad y estado sin
 * depender únicamente del color": el texto es el que dice en qué estado está.
 */
const CLAIM_STATUS_BADGES: Record<string, { label: string; tone: BadgeTone }> = {
  PENDING: { label: "Pendiente", tone: "danger" },
  IN_PROGRESS: { label: "En evaluación", tone: "accent" },
  RESOLVED: { label: "Atendido", tone: "success" },
  REJECTED: { label: "Rechazado", tone: "neutral" },
};

export const searchInClaim = (claim: ClaimRecordDTO) => [
  claim.claimCode,
  claim.fullName,
  claim.documentNumber,
  claim.email,
  claim.claimType,
];

const STATUS_FILTER: DataTableFilterDefinition<ClaimRecordDTO> = {
  id: "status",
  label: "Estado",
  options: [
    { value: "ALL", label: "Todos" },
    { value: "PENDING", label: "Pendientes" },
    { value: "IN_PROGRESS", label: "En evaluación" },
    { value: "RESOLVED", label: "Atendidos" },
    { value: "REJECTED", label: "Rechazados" },
  ],
  match: (claim, value) => claim.status === value,
};

export const CLAIM_FILTERS = [STATUS_FILTER];

/* "Sin datos inventados": una fecha ausente se nombra, no se sustituye por "—". */
const formatClaimDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("es-PE") : "Sin fecha";

export function buildClaimColumns(
  onOpenDetail: (claim: ClaimRecordDTO) => void
): readonly DataTableColumn<ClaimRecordDTO>[] {
  return [
    {
      id: "code",
      header: "Código",
      width: "w-[140px]",
      cell: (claim) => (
        <span className="font-mono text-[11px] font-bold text-brand-navy">{claim.claimCode}</span>
      ),
    },
    {
      id: "date",
      header: "Fecha",
      width: "w-[110px]",
      cell: (claim) => <TableText tone="muted">{formatClaimDate(claim.createdAt)}</TableText>,
    },
    {
      id: "consumer",
      header: "Consumidor",
      width: "min-w-[220px]",
      cell: (claim) => (
        <TableTitle
          title={claim.fullName}
          meta={`${claim.documentType} ${claim.documentNumber}`}
          clamp={1}
        />
      ),
    },
    {
      id: "type",
      header: "Tipo",
      width: "min-w-[170px]",
      cell: (claim) => <TableTitle title={claim.claimType} meta={claim.contractedType} clamp={1} />,
    },
    {
      id: "status",
      header: "Estado",
      width: "w-[130px]",
      cell: (claim) => {
        const badge = CLAIM_STATUS_BADGES[claim.status] ?? CLAIM_STATUS_BADGES.PENDING;
        return <Badge tone={badge.tone}>{badge.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      headerHidden: true,
      align: "end",
      width: "w-[64px]",
      cell: (claim) => (
        <TableRowActions
          label={`Acciones del reclamo ${claim.claimCode}`}
          actions={[
            {
              id: "detail",
              label: "Ver detalle y responder",
              onSelect: () => onOpenDetail(claim),
            },
          ]}
        />
      ),
    },
  ];
}
