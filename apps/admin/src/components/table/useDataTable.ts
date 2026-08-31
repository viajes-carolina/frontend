"use client";

import { useCallback, useMemo, useState } from "react";
import {
  hasActiveQuery as computeHasActiveQuery,
  resolveDefaultFilterValues,
  selectVisibleRows,
} from "./dataTableFilters";
import { buildPageItems } from "./tablePageItems";
import { DEFAULT_PAGE_SIZE } from "./tablePageSize";
import type {
  DataTableController,
  DataTableFilterDefinition,
  DataTableFilterState,
  DataTableHeaderCheckState,
  DataTablePaginationState,
  DataTableSelectionState,
} from "./types";

export interface UseDataTableOptions<T> {
  rows: readonly T[];
  /** Identificador estable de la fila. Es la clave de React y de la selección. */
  getRowId: (row: T) => string;
  /**
   * Campos donde busca el buscador. Si no se pasa, la tabla no tiene búsqueda.
   * Devolver `null`/`undefined` en un campo ausente es válido: se ignora.
   */
  searchIn?: (row: T) => ReadonlyArray<string | null | undefined>;
  filters?: readonly DataTableFilterDefinition<T>[];
  pageSize?: number;
  /** Activa la columna de selección y la barra de acciones masivas. */
  selectable?: boolean;
}

/* Referencia estable para el caso "sin filtros". Un `[]` literal como valor por
   defecto sería un array nuevo en cada render e invalidaría los `useMemo` que
   dependen de `filters`. `unknown` sirve para cualquier `T` porque `match`
   recibe la fila como parámetro (posición contravariante). */
const NO_FILTERS: readonly DataTableFilterDefinition<unknown>[] = [];

/**
 * Motor del kit de tabla: búsqueda, filtros, paginación y selección.
 *
 * ── Por qué un solo hook y no cuatro ─────────────────────────────────────
 * Las cuatro cosas están acopladas y el acoplamiento es justo lo que las
 * pantallas repiten mal: al buscar hay que volver a la página 1, al filtrar hay
 * que soltar la selección de las filas que dejaron de verse, y "seleccionar
 * todo" significa cosas distintas según si hay filtro puesto. Resolverlo una
 * vez aquí es el motivo de que exista el kit.
 *
 * ── Estado derivado, no efectos ──────────────────────────────────────────
 * No hay ningún `useEffect` de sincronización. La página se ACOTA al vuelo
 * (`Math.min(page, pageCount)`) en vez de corregirse en un efecto, y la
 * selección se PODA al vuelo contra las filas visibles. Con efectos, borrar la
 * última fila de la última página deja un render intermedio con la tabla vacía
 * antes de que el efecto reajuste; así no existe ese render.
 */
export function useDataTable<T>({
  rows,
  getRowId,
  searchIn,
  filters = NO_FILTERS,
  pageSize = DEFAULT_PAGE_SIZE,
  selectable = false,
}: UseDataTableOptions<T>): DataTableController<T> {
  const defaults = useMemo(() => resolveDefaultFilterValues(filters), [filters]);

  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set<string>());

  const filteredRows = useMemo(
    () => selectVisibleRows(rows, filters, filterValues, defaults, query, searchIn),
    [rows, filters, filterValues, defaults, query, searchIn]
  );

  /* ── Paginación ──────────────────────────────────────────────────────── */
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredRows, currentPage, pageSize]
  );

  const goTo = useCallback(
    (next: number) => setPage(Math.max(1, next)),
    []
  );

  const pagination: DataTablePaginationState = useMemo(() => {
    const totalRows = filteredRows.length;
    return {
      page: currentPage,
      pageCount,
      pageSize,
      totalRows,
      rangeStart: totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1,
      rangeEnd: Math.min(currentPage * pageSize, totalRows),
      items: buildPageItems(currentPage, pageCount),
      goTo,
      previous: () => goTo(currentPage - 1),
      next: () => goTo(currentPage + 1),
      canGoPrevious: currentPage > 1,
      canGoNext: currentPage < pageCount,
    };
  }, [filteredRows.length, currentPage, pageCount, pageSize, goTo]);

  /* ── Búsqueda y filtros ──────────────────────────────────────────────── */
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    /* Volver a la página 1: quedarse en la 4 tras teclear deja una tabla vacía
       que parece "sin resultados" cuando en realidad sí los hay, en la 1. */
    setPage(1);
  }, []);

  const filterStates: readonly DataTableFilterState[] = useMemo(
    () =>
      filters.map((filter) => {
        const value = filterValues[filter.id] ?? defaults[filter.id];
        const active = filter.options.find((option) => option.value === value);
        return {
          id: filter.id,
          label: filter.label,
          options: filter.options,
          value,
          activeOptionLabel: active?.label ?? value,
          isDefault: value === defaults[filter.id],
          onChange: (next: string) => {
            setFilterValues((current) => ({ ...current, [filter.id]: next }));
            setPage(1);
          },
        };
      }),
    [filters, filterValues, defaults]
  );

  const clearFilters = useCallback(() => {
    setQuery("");
    setFilterValues({});
    setPage(1);
  }, []);

  /* ── Selección ───────────────────────────────────────────────────────── */
  const filteredIds = useMemo(() => filteredRows.map(getRowId), [filteredRows, getRowId]);
  const pageIds = useMemo(() => pageRows.map(getRowId), [pageRows, getRowId]);

  /* La selección se poda contra las filas visibles: si una fila deja de pasar
     el filtro (o la borran), deja de contar. Sin esto, "Eliminar 3 elementos"
     podría actuar sobre filas que la persona ya no ve. */
  const effectiveSelectedIds = useMemo(
    () => filteredIds.filter((id) => selectedIds.has(id)),
    [filteredIds, selectedIds]
  );

  const selection: DataTableSelectionState | null = useMemo(() => {
    if (!selectable) {
      return null;
    }

    const selectedOnPage = pageIds.filter((id) => selectedIds.has(id)).length;
    const headerState: DataTableHeaderCheckState =
      selectedOnPage === 0 ? "none" : selectedOnPage === pageIds.length ? "all" : "some";

    const mutate = (mutation: (draft: Set<string>) => void) =>
      setSelectedIds((current) => {
        const draft = new Set(current);
        mutation(draft);
        return draft;
      });

    return {
      selectedIds: effectiveSelectedIds,
      selectedCount: effectiveSelectedIds.length,
      isSelected: (id: string) => selectedIds.has(id),
      toggle: (id: string) =>
        mutate((draft) => {
          if (!draft.delete(id)) {
            draft.add(id);
          }
        }),
      headerState,
      /* La casilla del encabezado gobierna la PÁGINA, no el conjunto: es la
         columna que encabeza, y marcar 400 filas invisibles desde una casilla
         sin aviso es justo lo que hace que la gente borre de más. Para el
         conjunto está `selectAllFiltered`, que la barra de acciones masivas
         ofrece con su número explícito. */
      togglePage: () =>
        mutate((draft) => {
          const selectAll = pageIds.some((id) => !draft.has(id));
          for (const id of pageIds) {
            if (selectAll) {
              draft.add(id);
            } else {
              draft.delete(id);
            }
          }
        }),
      selectAllFiltered: () => mutate((draft) => filteredIds.forEach((id) => draft.add(id))),
      clear: () => setSelectedIds(new Set<string>()),
      selectableCount: filteredIds.length,
      isPageFullySelected: pageIds.length > 0 && headerState === "all",
    };
  }, [selectable, pageIds, filteredIds, selectedIds, effectiveSelectedIds]);

  return {
    allRows: rows,
    filteredRows,
    pageRows,
    getRowId,
    search: { value: query, onChange: handleSearchChange, enabled: Boolean(searchIn) },
    filters: filterStates,
    hasActiveQuery: computeHasActiveQuery(query, filterValues, defaults),
    clearFilters,
    pagination,
    selection,
    emptyReason:
      rows.length === 0 ? "no-rows" : filteredRows.length === 0 ? "no-matches" : "none",
  };
}
