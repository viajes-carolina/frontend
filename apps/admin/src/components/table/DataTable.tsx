"use client";

import React from "react";
import { SelectionCheckbox } from "./SelectionCheckbox";
import {
  ALIGN_CLASSES,
  BODY_CELL_CLASSES,
  HEADER_CELL_CLASSES,
} from "./tableStyles";
import type { DataTableColumn, DataTableSelectionState } from "./types";

/**
 * La `<table>` en sí: encabezado, filas y columna de selección.
 *
 * Se exporta suelta además de dentro de `AdminDataTable` para la pantalla que
 * necesite otra composición (por ejemplo, dos tablas bajo una sola barra de
 * herramientas). Búsqueda, filtros, paginación y vacíos NO están aquí.
 *
 * ── Semántica ────────────────────────────────────────────────────────────
 * `<table>` de verdad con `<th scope="col">` en cada columna. La columna de
 * acciones declara su encabezado igual que las demás, solo que oculto a la
 * vista (`headerHidden`): sin él, un lector de pantalla anuncia esa celda sin
 * ninguna cabecera.
 *
 * El `<caption>` es obligatorio y va en `sr-only`: es lo que da nombre a la
 * tabla al navegar por regiones.
 *
 * ── Desbordamiento ───────────────────────────────────────────────────────
 * El scroll horizontal vive en el contenedor de la tabla, con `min-w-0` para
 * que dentro de un flex no crezca en vez de desplazar. La `<table>` lleva un
 * ancho mínimo propio: sin él, las columnas se comprimirían hasta romper el
 * texto en lugar de provocar el desplazamiento.
 *
 * El `relative` del contenedor NO es decorativo y no se puede quitar. `sr-only`
 * es `position: absolute`, y un absoluto sin ancestro posicionado toma como
 * bloque contenedor el inicial — el de la ventana. Entonces deja de estar
 * sujeto al recorte de este contenedor y suma su posición al desplazamiento
 * horizontal del DOCUMENTO: con una tabla de 840px en una ventana de 600, el
 * `<span class="sr-only">` del encabezado oculto de la columna de acciones
 * llevaba `document.documentElement.scrollWidth` a 848px y la página entera se
 * desplazaba de lado. Con `relative`, el bloque contenedor pasa a ser este div
 * y el texto invisible queda dentro del recorte, que es justo lo que la guía
 * pide: la tabla desborda dentro de su caja, no empuja el ancho de la página.
 * Lo mismo vale para el `<caption>`.
 *
 * El contenedor es además una región enfocable (`tabIndex={0}` + `role="group"`
 * con nombre) porque un área que se desplaza y no se puede alcanzar con el
 * teclado deja su contenido derecho inaccesible para quien no usa ratón.
 */
export interface DataTableProps<T> {
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  /** Nombre de la tabla para lectores de pantalla. */
  caption: string;
  selection?: DataTableSelectionState | null;
  /** Nombre accesible de la casilla de cada fila ("Seleccionar «Madrid»"). */
  getRowLabel?: (row: T) => string;
  /** Ancho mínimo de la tabla; por debajo, el contenedor desplaza. */
  minWidthClassName?: string;
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  caption,
  selection,
  getRowLabel,
  minWidthClassName = "min-w-[720px]",
}: DataTableProps<T>) {
  const headerLabel =
    selection?.headerState === "all"
      ? "Quitar la selección de las filas de esta página"
      : "Seleccionar todas las filas de esta página";

  return (
    <div
      role="group"
      aria-label={caption}
      tabIndex={0}
      className="relative min-w-0 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-info"
    >
      <table className={`w-full border-collapse text-left ${minWidthClassName}`}>
        <caption className="sr-only">{caption}</caption>

        <thead>
          <tr className="bg-admin-field">
            {selection && (
              <th scope="col" className={`${HEADER_CELL_CLASSES} w-[52px]`}>
                <SelectionCheckbox
                  checked={selection.headerState === "all"}
                  indeterminate={selection.headerState === "some"}
                  onChange={selection.togglePage}
                  label={headerLabel}
                />
              </th>
            )}

            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`${HEADER_CELL_CLASSES} ${ALIGN_CLASSES[column.align ?? "start"]} ${
                  column.width ?? ""
                }`}
              >
                {column.headerHidden ? (
                  <span className="sr-only">{column.header}</span>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            const selected = selection?.isSelected(id) ?? false;

            return (
              <tr
                key={id}
                /* `border-t` y no `divide-y`: el separador de la guía va ENCIMA
                   de cada fila, así que la primera lo lleva contra el
                   encabezado. */
                className={`border-t border-neutral-quiet-surface transition-colors ${
                  selected ? "bg-row-selected-surface" : "bg-white hover:bg-neutral-soft"
                }`}
              >
                {selection && (
                  <td className={BODY_CELL_CLASSES}>
                    <SelectionCheckbox
                      checked={selected}
                      onChange={() => selection.toggle(id)}
                      label={getRowLabel ? `Seleccionar ${getRowLabel(row)}` : "Seleccionar fila"}
                    />
                  </td>
                )}

                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`${BODY_CELL_CLASSES} ${ALIGN_CLASSES[column.align ?? "start"]} ${
                      column.cellClassName ?? ""
                    }`}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
