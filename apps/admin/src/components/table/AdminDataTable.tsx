"use client";

import React from "react";
import { TableSkeleton } from "@vc/ui";
import { DataTable } from "./DataTable";
import { TableBulkActions } from "./TableBulkActions";
import { TableEmptyState } from "./TableEmptyState";
import { TablePagination } from "./TablePagination";
import { TableToolbar } from "./TableToolbar";
import type {
  DataTableBulkAction,
  DataTableColumn,
  DataTableController,
  DataTableEmptyCopy,
  DataTableNoResultsCopy,
} from "./types";

/**
 * La tabla completa del panel: barra de herramientas, acciones masivas, tabla,
 * paginación y estados vacíos, en una sola tarjeta.
 *
 * Es la pieza que una pantalla usa el 90% de las veces:
 *
 *   const table = useDataTable({ rows, getRowId, searchIn, filters, selectable: true });
 *   <AdminDataTable controller={table} columns={columns} caption="…" emptyState={…} />
 *
 * La pantalla declara sus columnas y sus filtros; todo lo demás lo pone el kit.
 * Quien necesite otra composición monta las piezas sueltas, que se exportan
 * también.
 *
 * ── Orden de los bloques ─────────────────────────────────────────────────
 * La barra de acciones masivas va DEBAJO de la de herramientas y no en su
 * lugar: la búsqueda "permanece visible" (principio 01) también mientras hay
 * filas marcadas.
 *
 * ── Qué se ve cuando no hay filas ────────────────────────────────────────
 * El estado vacío sustituye a la tabla y a la paginación, pero NO a la barra de
 * herramientas: si el vacío viene de un filtro, quitarlo tiene que estar a
 * mano. `TableEmptyState` decide el mensaje según el motivo que trae el
 * controlador.
 */
export interface AdminDataTableProps<T> {
  controller: DataTableController<T>;
  columns: readonly DataTableColumn<T>[];
  /** Nombre de la tabla para lectores de pantalla. */
  caption: string;
  emptyState: DataTableEmptyCopy;
  noResultsState?: DataTableNoResultsCopy;
  searchPlaceholder?: string;
  searchLabel?: string;
  createAction?: { label: string; onSelect: () => void; disabled?: boolean };
  bulkActions?: readonly DataTableBulkAction[];
  /** Nombre accesible de la casilla de cada fila. */
  getRowLabel?: (row: T) => string;
  /** Cómo se llama lo que se cuenta en el pie: "promociones", "reclamos"… */
  itemNoun?: string;
  minWidthClassName?: string;
  /** Mientras carga se pinta el esqueleto en lugar de toda la tarjeta. */
  loading?: boolean;
  /**
   * Hay una petición en curso pero YA se está viendo algo.
   *
   * No es `loading`: cambiar de página o teclear en el buscador con paginación
   * en servidor abre una petición, y sustituir la tarjeta por el esqueleto
   * desmontaría el campo de búsqueda con el cursor dentro. Aquí las filas se
   * atenúan y se marca `aria-busy`; la barra de herramientas no se mueve.
   */
  busy?: boolean;
  className?: string;
}

const CARD_CLASSES =
  "min-w-0 overflow-hidden rounded-[12px] border border-neutral-border bg-white shadow-[0_8px_24px_rgba(17,34,48,0.06)]";

export function AdminDataTable<T>({
  controller,
  columns,
  caption,
  emptyState,
  noResultsState,
  searchPlaceholder,
  searchLabel,
  createAction,
  bulkActions,
  getRowLabel,
  itemNoun,
  minWidthClassName,
  loading = false,
  busy = false,
  className = "",
}: AdminDataTableProps<T>) {
  if (loading) {
    return <TableSkeleton className={className} />;
  }

  const { selection, emptyReason } = controller;
  const showBulkBar = Boolean(selection && bulkActions && bulkActions.length > 0);

  return (
    <div className={`${CARD_CLASSES} ${className}`}>
      <TableToolbar
        search={controller.search}
        searchPlaceholder={searchPlaceholder}
        searchLabel={searchLabel}
        filters={controller.filters}
        createAction={createAction}
      />

      {showBulkBar && selection && bulkActions && (
        <TableBulkActions selection={selection} actions={bulkActions} />
      )}

      {emptyReason === "none" ? (
        <div
          aria-busy={busy || undefined}
          className={busy ? "opacity-60 transition-opacity duration-150" : undefined}
        >
          <DataTable
            rows={controller.pageRows}
            columns={columns}
            getRowId={controller.getRowId}
            caption={caption}
            selection={selection}
            getRowLabel={getRowLabel}
            minWidthClassName={minWidthClassName}
          />
          <TablePagination pagination={controller.pagination} itemNoun={itemNoun} />
        </div>
      ) : (
        <TableEmptyState
          reason={emptyReason}
          empty={emptyState}
          noResults={noResultsState}
          onClearFilters={controller.clearFilters}
        />
      )}
    </div>
  );
}
