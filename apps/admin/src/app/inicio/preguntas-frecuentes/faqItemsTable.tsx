"use client";

import React from "react";
import type { FaqItemDTO } from "@vc/api-client";
import { Badge } from "@vc/ui";
import {
  TableRowActions,
  TableTitle,
  type DataTableColumn,
  type DataTableFilterDefinition,
} from "../../../components/table";

/* ==========================================================================
   Declaración de la tabla de Preguntas frecuentes de la portada.
   ========================================================================== */

/** Categoría normalizada: la fila sin categoría cuenta como "General". */
export const faqCategory = (faq: FaqItemDTO): string => faq.category?.trim() || "General";

export const searchInFaq = (faq: FaqItemDTO) => [faq.question, faq.answer, faqCategory(faq)];

const STATUS_FILTER: DataTableFilterDefinition<FaqItemDTO> = {
  id: "status",
  label: "Estado",
  options: [
    { value: "ALL", label: "Todas" },
    { value: "ACTIVE", label: "Activas" },
    { value: "INACTIVE", label: "Inactivas" },
  ],
  match: (faq, value) => (value === "ACTIVE" ? faq.active : !faq.active),
};

/**
 * Filtro de categoría construido con las categorías que REALMENTE existen. Una
 * lista fija ofrecería opciones que no devuelven ninguna fila, y "los filtros
 * muestran su estado activo" pierde sentido si el estado activo no filtra nada.
 */
export function buildFaqFilters(
  faqs: readonly FaqItemDTO[]
): readonly DataTableFilterDefinition<FaqItemDTO>[] {
  const names = Array.from(new Set(faqs.map(faqCategory))).sort((a, b) => a.localeCompare(b, "es"));

  return [
    STATUS_FILTER,
    {
      id: "category",
      label: "Categoría",
      options: [
        { value: "ALL", label: "Todas" },
        ...names.map((name) => ({ value: name, label: name })),
      ],
      match: (faq, value) => faqCategory(faq) === value,
    },
  ];
}

export interface FaqColumnHandlers {
  onEdit: (faq: FaqItemDTO) => void;
  onDeactivate: (faq: FaqItemDTO) => void;
}

export function buildFaqColumns({
  onEdit,
  onDeactivate,
}: FaqColumnHandlers): readonly DataTableColumn<FaqItemDTO>[] {
  return [
    {
      id: "category",
      header: "Categoría",
      width: "w-[160px]",
      /* La categoría clasifica, no alerta: tono informativo. */
      cell: (faq) => <Badge tone="info">{faqCategory(faq)}</Badge>,
    },
    {
      id: "question",
      header: "Pregunta frecuente",
      width: "min-w-[260px]",
      cell: (faq) => <TableTitle title={faq.question} meta={`Orden ${faq.displayOrder ?? 0}`} />,
    },
    {
      id: "answer",
      header: "Respuesta",
      width: "min-w-[280px]",
      cell: (faq) => (
        <span className="line-clamp-2 font-inter text-[10px] leading-[1.5] text-neutral-quiet-ink">
          {faq.answer}
        </span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      width: "w-[110px]",
      /* Visible en el acordeón = éxito; retirada = neutro. */
      cell: (faq) => (
        <Badge tone={faq.active ? "success" : "neutral"}>{faq.active ? "Activa" : "Inactiva"}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      headerHidden: true,
      align: "end",
      width: "w-[64px]",
      cell: (faq) => (
        <TableRowActions
          label={`Acciones de la pregunta "${faq.question}"`}
          actions={[
            { id: "edit", label: "Editar", onSelect: () => onEdit(faq) },
            {
              id: "deactivate",
              label: "Desactivar",
              tone: "danger",
              disabled: !faq.active,
              onSelect: () => onDeactivate(faq),
            },
          ]}
        />
      ),
    },
  ];
}
