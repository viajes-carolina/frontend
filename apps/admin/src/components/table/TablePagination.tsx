"use client";

import React from "react";
import { SMALL_ACTION_CLASSES } from "./tableStyles";
import type { DataTablePaginationState } from "./types";

/**
 * Pie de tabla: cuánto se está viendo y cómo moverse.
 *
 * ── Principio 04: "15–20 filas por página como máximo" ───────────────────
 * El tamaño lo fija `useDataTable` (15). Aquí solo se pinta.
 *
 * ── Anatomía (guía) ──────────────────────────────────────────────────────
 * Pie blanco, padding 16, justificado entre extremos. Conteo de 10px sobre
 * `neutral-quiet-ink`. Botones radio 6, padding 11/8, 10px semibold, gap 6.
 * Inactivo blanco con borde `neutral-border`; ACTIVO `brand-navy` con texto
 * blanco. Flechas ‹ y ›.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * `<nav>` con nombre, la página actual marcada con `aria-current="page"` (no
 * solo con el fondo navy) y cada número con su `aria-label` "Página 3" — un
 * "3" suelto no dice nada leído en voz alta. Las flechas llevan su texto en
 * `aria-label` porque ‹ y › tampoco se leen.
 *
 * El conteo va en un `role="status"`: al cambiar de página el foco se queda en
 * el botón pulsado y, sin esto, nada anuncia que ahora se ven otras filas.
 */
export interface TablePaginationProps {
  pagination: DataTablePaginationState;
  /** Nombre de lo que se cuenta: "registros", "reclamos", "artículos". */
  itemNoun?: string;
}

const PAGE_BUTTON_IDLE = "border border-neutral-border bg-white text-brand-navy hover:bg-neutral-soft";
const PAGE_BUTTON_ACTIVE = "border border-brand-navy bg-brand-navy text-white";

export function TablePagination({ pagination, itemNoun = "registros" }: TablePaginationProps) {
  const { page, pageCount, totalRows, rangeStart, rangeEnd, items } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-divider-soft bg-white p-4">
      <p role="status" aria-live="polite" className="font-inter text-[10px] leading-[1.4] text-neutral-quiet-ink">
        {totalRows === 0
          ? `Sin ${itemNoun} que mostrar`
          : `Mostrando ${rangeStart}–${rangeEnd} de ${totalRows} ${itemNoun}`}
      </p>

      {pageCount > 1 && (
        <nav aria-label="Paginación de la tabla">
          <ul className="flex flex-wrap items-center gap-1.5">
            <li>
              <button
                type="button"
                aria-label="Página anterior"
                disabled={!pagination.canGoPrevious}
                onClick={pagination.previous}
                className={`${SMALL_ACTION_CLASSES} ${PAGE_BUTTON_IDLE}`}
              >
                <span aria-hidden="true">‹</span>
              </button>
            </li>

            {items.map((item) =>
              item.kind === "ellipsis" ? (
                <li
                  key={item.key}
                  aria-hidden="true"
                  className="px-1 font-inter text-[10px] font-semibold text-neutral-quiet-ink"
                >
                  …
                </li>
              ) : (
                <li key={item.page}>
                  <button
                    type="button"
                    aria-label={`Página ${item.page}`}
                    aria-current={item.page === page ? "page" : undefined}
                    onClick={() => pagination.goTo(item.page)}
                    className={`${SMALL_ACTION_CLASSES} ${
                      item.page === page ? PAGE_BUTTON_ACTIVE : PAGE_BUTTON_IDLE
                    }`}
                  >
                    {item.page}
                  </button>
                </li>
              )
            )}

            <li>
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={!pagination.canGoNext}
                onClick={pagination.next}
                className={`${SMALL_ACTION_CLASSES} ${PAGE_BUTTON_IDLE}`}
              >
                <span aria-hidden="true">›</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
