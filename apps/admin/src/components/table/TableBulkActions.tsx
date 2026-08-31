"use client";

import React from "react";
import { FOCUS_RING_CLASSES, SMALL_ACTION_CLASSES } from "./tableStyles";
import type { DataTableBulkAction, DataTableSelectionState } from "./types";

/**
 * Barra de acciones masivas.
 *
 * ── Principio 03: "Las acciones masivas aparecen solo cuando aplican" ────
 * Sin selección no hay barra: ni atenuada ni con los botones deshabilitados.
 *
 * ── Cómo se anuncia al aparecer ──────────────────────────────────────────
 * El `role="status"` está SIEMPRE montado, vacío mientras no hay selección, y
 * lo que aparece dentro es la barra. Es la diferencia entre que un lector de
 * pantalla lea "2 elementos seleccionados" y que no lea nada: una región viva
 * que se monta a la vez que su contenido no dispara anuncio en varios lectores,
 * porque no llegan a observar el cambio — observan la aparición del nodo entero.
 *
 * `aria-atomic` hace que se lea la frase completa y no solo el número que
 * cambió, que fuera de contexto no dice nada.
 *
 * ── "Seleccionar los N" ──────────────────────────────────────────────────
 * La casilla del encabezado marca la PÁGINA. Cuando la página queda entera y
 * aún hay más filas filtradas, aquí aparece la vía explícita para extender la
 * selección a todas, con su número delante. Es la respuesta a "seleccionar
 * todo" sin que una casilla marque en silencio filas que nadie ha visto.
 *
 * Solo aparece si la tabla PUEDE cumplirlo: `selectAllFiltered` y
 * `selectableCount` son opcionales, y con la lista paginada en servidor llegan
 * sin definir porque el navegador no tiene las demás páginas. Ofrecer entonces
 * "seleccionar los 32" y marcar 15 sería mentir sobre lo que va a pasar, así
 * que el enlace directamente no se pinta.
 *
 * ── Anatomía (guía) ──────────────────────────────────────────────────────
 * Fondo `info-surface`, padding 16/10, gap 10. Conteo 11px semibold sobre
 * `info`. Acciones blancas con borde `info-border`, radio 6, texto 10px
 * semibold; la destructiva en `danger-ink`.
 */
export interface TableBulkActionsProps {
  selection: DataTableSelectionState;
  actions: readonly DataTableBulkAction[];
}

const ACTION_TONE_CLASSES = {
  default: "border border-info-border bg-white text-brand-navy hover:bg-neutral-soft",
  danger: "border border-info-border bg-white text-danger-ink hover:bg-danger-surface",
} as const;

export function TableBulkActions({ selection, actions }: TableBulkActionsProps) {
  const { selectedCount, selectedIds, selectableCount, selectAllFiltered, isPageFullySelected } =
    selection;
  const canExtend =
    Boolean(selectAllFiltered) &&
    selectableCount !== undefined &&
    isPageFullySelected &&
    selectedCount < selectableCount;

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 border-t border-divider-soft bg-info-surface px-4 py-2.5">
          <span className="font-inter text-[11px] font-semibold leading-none text-info">
            {selectedCount === 1
              ? "1 elemento seleccionado"
              : `${selectedCount} elementos seleccionados`}
          </span>

          {canExtend && (
            <button
              type="button"
              onClick={selectAllFiltered}
              className={`rounded-[4px] font-inter text-[10px] font-semibold leading-none text-info underline underline-offset-2 hover:no-underline ${FOCUS_RING_CLASSES}`}
            >
              Seleccionar los {selectableCount} de todas las páginas
            </button>
          )}

          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              onClick={() => action.onSelect(selectedIds)}
              className={`${SMALL_ACTION_CLASSES} ${ACTION_TONE_CLASSES[action.tone ?? "default"]}`}
            >
              {action.label}
            </button>
          ))}

          <button
            type="button"
            onClick={selection.clear}
            className={`ml-auto rounded-[4px] font-inter text-[10px] font-semibold leading-none text-info underline underline-offset-2 hover:no-underline ${FOCUS_RING_CLASSES}`}
          >
            Quitar selección
          </button>
        </div>
      )}
    </div>
  );
}
