"use client";

import React from "react";
import { Button } from "@vc/ui";
import { TableEmptyIcon } from "./TableIcons";
import type { DataTableEmptyCopy, DataTableNoResultsCopy } from "./types";

/**
 * Los dos vacíos de una tabla, que no son el mismo vacío.
 *
 *   no-rows      todavía no existe ningún registro. La acción útil es CREAR.
 *   no-matches   hay registros, pero ninguno pasa la búsqueda o los filtros.
 *                La acción útil es LIMPIAR — ofrecer "Nueva promoción" aquí
 *                manda a crear algo que quizá ya existe dos filtros más allá.
 *
 * Distinguirlos es la mitad del trabajo: "Aún no hay promociones" delante de un
 * catálogo de 32 con un filtro puesto es información falsa.
 *
 * ── Anatomía (guía, "Estados del sistema") ───────────────────────────────
 * Centrado, gap 14, ilustración circular de 72px, mensaje de 12px sobre
 * `neutral-quiet-ink` y un botón. "Explica qué falta y ofrece una acción útil."
 *
 * El botón de limpiar es `secondary` y no `primary`: la guía reserva el naranja
 * para la acción principal del bloque, y quitar un filtro no lo es.
 */
export interface TableEmptyStateProps {
  reason: "no-rows" | "no-matches";
  empty: DataTableEmptyCopy;
  noResults?: DataTableNoResultsCopy;
  onClearFilters: () => void;
}

const DEFAULT_NO_RESULTS: Required<DataTableNoResultsCopy> = {
  title: "Ningún registro coincide",
  description:
    "La búsqueda o los filtros activos dejan la tabla vacía. Prueba con otras palabras o vuelve a verlos todos.",
  clearLabel: "Limpiar búsqueda y filtros",
};

export function TableEmptyState({
  reason,
  empty,
  noResults,
  onClearFilters,
}: TableEmptyStateProps) {
  const isNoRows = reason === "no-rows";
  const title = isNoRows ? empty.title : (noResults?.title ?? DEFAULT_NO_RESULTS.title);
  const description = isNoRows
    ? empty.description
    : (noResults?.description ?? DEFAULT_NO_RESULTS.description);

  return (
    <div className="flex flex-col items-center gap-3.5 border-t border-divider-soft bg-white px-6 py-14 text-center">
      <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-neutral-quiet-surface text-neutral-quiet-ink">
        {isNoRows && empty.icon ? empty.icon : <TableEmptyIcon size={28} />}
      </span>

      <div className="space-y-1.5">
        <p className="font-inter text-[12px] font-semibold leading-[1.4] text-admin-heading">
          {title}
        </p>
        <p className="mx-auto max-w-[380px] font-inter text-[12px] leading-[1.5] text-neutral-quiet-ink">
          {description}
        </p>
      </div>

      {isNoRows
        ? empty.action && (
            <Button variant="primary" onClick={empty.action.onSelect}>
              {empty.action.label}
            </Button>
          )
        : (
            <Button variant="secondary" onClick={onClearFilters}>
              {noResults?.clearLabel ?? DEFAULT_NO_RESULTS.clearLabel}
            </Button>
          )}
    </div>
  );
}
