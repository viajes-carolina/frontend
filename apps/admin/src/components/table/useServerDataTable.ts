"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { buildPageItems } from "./tablePageItems";
import { DEFAULT_PAGE_SIZE } from "./tablePageSize";
import type {
  DataTableController,
  DataTableFilterState,
  DataTableHeaderCheckState,
  DataTablePaginationState,
  DataTableSelectionState,
  DataTableServerFilterDefinition,
} from "./types";

/* ==========================================================================
   Motor del kit cuando quien busca, filtra y pagina es el SERVIDOR.

   ── Por qué un hook aparte y no un modo dentro de `useDataTable` ─────────
   `useDataTable` no es una carcasa de estado: es un pipeline que RECIBE todas
   las filas y las recorta (`selectVisibleRows` → `slice`). Un `mode: "server"`
   dentro dejaría ese pipeline sin entrada y habría que puentear en cinco sitios
   —filtrado, conteo, paginación, poda de la selección y `emptyReason`— cada uno
   con su `if`. Las cuatro pantallas que hoy filtran en cliente (`/blog`,
   `/reclamaciones`, FAQ y testimonios) pagarían ese riesgo sin ganar nada.

   Lo que sí se comparte es el CONTRATO: este hook devuelve el mismo
   `DataTableController<T>`, así que `AdminDataTable`, `TableToolbar`,
   `TableFilterMenu`, `TablePagination`, `TableBulkActions` y `TableEmptyState`
   funcionan sin tocar una línea. La costura está en el tipo, no en el motor.

   ── Qué NO puede hacer este modo ─────────────────────────────────────────
   El navegador solo tiene la página visible, así que no puede ofrecer
   "seleccionar los N de todas las páginas" (no tiene los ids de las demás) ni
   exponer `allRows`/`filteredRows`. Esos campos vienen sin definir en vez de
   rellenarse con la página, que sería un número correcto sobre una pregunta
   distinta.
   ========================================================================== */

/** Lo que hay que pedirle al servidor. `page` es base 1, como la paginación. */
export interface ServerDataTableQuery {
  page: number;
  pageSize: number;
  /** Texto ya estabilizado por el debounce, no lo que hay en el campo. */
  search: string;
  /** Solo los filtros fuera de su valor por defecto. */
  filters: Readonly<Record<string, string>>;
}

export interface UseServerDataTableOptions<T> {
  /** Las filas de la página actual, tal como llegaron. No se reordenan. */
  rows: readonly T[];
  getRowId: (row: T) => string;
  /** `total` del servidor: filas que cumplen los filtros. Alimenta el pie. */
  totalRows: number;
  /**
   * Filas del catálogo SIN filtros. Es lo único que distingue "aún no hay nada"
   * de "nada coincide con este filtro", y por eso no se puede deducir de
   * `totalRows`: valiendo 0, las dos frases son ciertas para el cliente.
   */
  unfilteredTotal: number;
  filters?: readonly DataTableServerFilterDefinition[];
  /** Si la tabla tiene buscador. El servidor es quien busca. */
  searchable?: boolean;
  pageSize?: number;
  selectable?: boolean;
  /**
   * Cuánto espera el buscador antes de convertirse en una petición. Con 0 se
   * dispara una por pulsación, que es exactamente lo que hay que evitar.
   */
  searchDebounceMs?: number;
}

export interface ServerDataTable<T> {
  controller: DataTableController<T>;
  /**
   * La consulta vigente. Su IDENTIDAD solo cambia cuando cambia su contenido,
   * así que sirve tal cual como dependencia del efecto que hace el fetch.
   */
  query: ServerDataTableQuery;
  /** `true` mientras el campo escrito todavía no ha llegado a `query`. */
  isSearchPending: boolean;
}

const NO_FILTERS: readonly DataTableServerFilterDefinition[] = [];
const NO_IDS: readonly string[] = [];

function resolveDefaults(
  filters: readonly DataTableServerFilterDefinition[]
): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const filter of filters) {
    defaults[filter.id] = filter.defaultValue ?? filter.options[0]?.value ?? "";
  }
  return defaults;
}

/** Clave estable de una consulta: dos consultas iguales dan la misma cadena. */
function queryToken(query: ServerDataTableQuery): string {
  const filters = Object.keys(query.filters)
    .sort()
    .map((id) => `${id}=${query.filters[id]}`)
    .join("&");
  return `${query.page}|${query.pageSize}|${query.search}|${filters}`;
}

export function useServerDataTable<T>({
  rows,
  getRowId,
  totalRows,
  unfilteredTotal,
  filters = NO_FILTERS,
  searchable = false,
  pageSize = DEFAULT_PAGE_SIZE,
  selectable = false,
  searchDebounceMs = 350,
}: UseServerDataTableOptions<T>): ServerDataTable<T> {
  const defaults = useMemo(() => resolveDefaults(filters), [filters]);

  /* Dos textos, no uno: `typed` es lo que se ve en el campo y se actualiza en
     cada tecla (si no, el cursor se pelearía con el valor controlado); `applied`
     es el que viaja al servidor y va un debounce por detrás. */
  const [typed, setTyped] = useState("");
  const [applied, setApplied] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setTyped(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const commit = () => {
        setApplied(value);
        /* Volver a la página 1 al buscar: quedarse en la 4 deja una tabla vacía
           que parece "sin resultados" cuando los hay, en la 1. */
        setPage(1);
      };
      if (searchDebounceMs <= 0) {
        commit();
        return;
      }
      debounceRef.current = setTimeout(commit, searchDebounceMs);
    },
    [searchDebounceMs]
  );

  /* ── Consulta ────────────────────────────────────────────────────────── */

  const activeFilters = useMemo(() => {
    const active: Record<string, string> = {};
    for (const filter of filters) {
      const value = filterValues[filter.id] ?? defaults[filter.id];
      if (value !== defaults[filter.id]) active[filter.id] = value;
    }
    return active;
  }, [filters, filterValues, defaults]);

  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  /* La página se ACOTA al vuelo, sin efecto de corrección: si borrar la última
     fila deja la página 3 fuera de rango, se pide la 2 en el mismo render en vez
     de pintar un hueco y arreglarlo después. */
  const currentPage = Math.min(page, pageCount);

  /* La identidad de `query` es lo que dispara el fetch en quien lo consume, así
     que tiene que cambiar SOLO cuando cambia su contenido. Se sostiene sobre que
     `activeFilters` es a su vez un `useMemo` estable — y eso exige que la
     pantalla memorice el array `filters`, igual que ya se lo exige el motor de
     modo cliente. Sin eso, cada render sería una petición. */
  const query = useMemo<ServerDataTableQuery>(
    () => ({ page: currentPage, pageSize, search: applied, filters: activeFilters }),
    [currentPage, pageSize, applied, activeFilters]
  );

  const token = queryToken(query);

  /* ── Paginación ──────────────────────────────────────────────────────── */

  const goTo = useCallback((next: number) => setPage(Math.max(1, next)), []);

  const pagination: DataTablePaginationState = useMemo(
    () => ({
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
    }),
    [currentPage, pageCount, pageSize, totalRows, goTo]
  );

  /* ── Filtros ─────────────────────────────────────────────────────────── */

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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTyped("");
    setApplied("");
    setFilterValues({});
    setPage(1);
  }, []);

  /* ── Selección ───────────────────────────────────────────────────────── */

  /**
   * La selección se guarda JUNTO A la consulta que la produjo y solo cuenta
   * mientras esa consulta sigue vigente.
   *
   * En modo cliente la selección podía sobrevivir a un cambio de página porque
   * las filas seguían en memoria: se podaba contra las filtradas y "3
   * seleccionados" siempre podía nombrar esas 3. Aquí no. Al pasar a la página
   * 2 las filas de la 1 desaparecen del navegador, y una selección superviviente
   * dejaría la barra diciendo "5 elementos seleccionados" sobre filas de las que
   * ya no se conoce ni el título ni si están visibles — justo los dos datos con
   * los que la acción masiva decide qué omitir y con los que redacta el parte de
   * lo que se aplicó y lo que no.
   *
   * Así que la selección es de la PÁGINA: cambiar de página, buscar o filtrar la
   * suelta. Se descarta comparando el token en el render, sin `useEffect`, para
   * que no exista un render intermedio con la selección vieja sobre filas
   * nuevas.
   */
  const [selectionState, setSelectionState] = useState<{
    token: string;
    ids: ReadonlySet<string>;
  }>(() => ({ token, ids: new Set<string>() }));

  const pageIds = useMemo(() => rows.map(getRowId), [rows, getRowId]);

  const selection: DataTableSelectionState | null = useMemo(() => {
    if (!selectable) return null;

    const live = selectionState.token === token ? selectionState.ids : null;
    const selectedIds = live ? pageIds.filter((id) => live.has(id)) : NO_IDS;
    const headerState: DataTableHeaderCheckState =
      selectedIds.length === 0
        ? "none"
        : selectedIds.length === pageIds.length
          ? "all"
          : "some";

    const mutate = (mutation: (draft: Set<string>) => void) =>
      setSelectionState((current) => {
        const draft = new Set(current.token === token ? current.ids : []);
        mutation(draft);
        return { token, ids: draft };
      });

    return {
      selectedIds,
      selectedCount: selectedIds.length,
      isSelected: (id: string) => Boolean(live?.has(id)),
      toggle: (id: string) =>
        mutate((draft) => {
          if (!draft.delete(id)) draft.add(id);
        }),
      headerState,
      togglePage: () =>
        mutate((draft) => {
          const selectAll = pageIds.some((id) => !draft.has(id));
          for (const id of pageIds) {
            if (selectAll) draft.add(id);
            else draft.delete(id);
          }
        }),
      /* Sin `selectAllFiltered` ni `selectableCount` a propósito: son las dos
         piezas del enlace "seleccionar los N de todas las páginas", y ese enlace
         aquí no se puede cumplir. `TableBulkActions` lo omite al verlas sin
         definir. */
      clear: () => setSelectionState({ token, ids: new Set<string>() }),
      isPageFullySelected: pageIds.length > 0 && headerState === "all",
    };
  }, [selectable, selectionState, token, pageIds]);

  /* ── Vacíos ──────────────────────────────────────────────────────────── */

  return {
    controller: {
      pageRows: rows,
      getRowId,
      search: { value: typed, onChange: handleSearchChange, enabled: searchable },
      filters: filterStates,
      hasActiveQuery: typed.trim().length > 0 || Object.keys(activeFilters).length > 0,
      clearFilters,
      pagination,
      selection,
      /* El catálogo vacío se decide con el conteo SIN filtros, no con las filas
         devueltas: "Aún no hay promociones" delante de 32 con un filtro puesto
         es información falsa. */
      emptyReason:
        unfilteredTotal === 0 ? "no-rows" : totalRows === 0 ? "no-matches" : "none",
    },
    query,
    isSearchPending: typed !== applied,
  };
}
