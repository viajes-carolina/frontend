import type React from "react";

/* ==========================================================================
   Contratos del kit de tabla del panel — guía de estilo, sección
   "Tablas y filtros".

   La idea de la API: una pantalla DECLARA sus columnas y sus filtros, y el kit
   se encarga de buscar, filtrar, paginar, seleccionar y de los dos estados
   vacíos. Nada de esto se reescribe por pantalla.

   Todo vive en `apps/admin` y no en `packages/ui` porque depende de tokens que
   solo declara el `@theme` del panel (`info`, `admin-*`, `neutral-quiet-*`) y
   porque el sitio público no tiene tablas de administración.
   ========================================================================== */

export type DataTableAlign = "start" | "center" | "end";

/**
 * Una columna. `cell` recibe la fila y devuelve JSX: para las celdas típicas
 * usa las composiciones de `TableCells` (miniatura, título+meta, badge, switch,
 * texto, menú de acciones) en vez de escribir el marcado a mano.
 */
export interface DataTableColumn<T> {
  /** Identificador estable; se usa como `key` de la celda. */
  id: string;
  /** Texto del `<th scope="col">`. Se pinta en mayúsculas por CSS. */
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: DataTableAlign;
  /**
   * Clase de ancho de Tailwind aplicada al `<th>` (`"w-[86px]"`,
   * `"min-w-[280px]"`). Es una clase y no un número para que el ancho pueda
   * expresarse en cualquier unidad sin `style` en línea.
   */
  width?: string;
  /**
   * El encabezado sigue existiendo para lectores de pantalla pero no se pinta.
   * Es lo correcto para la columna de acciones ("•••"), que no tiene título
   * visible pero sí necesita nombre en la tabla.
   */
  headerHidden?: boolean;
  /** Clases extra para las celdas de cuerpo de esta columna. */
  cellClassName?: string;
}

export interface DataTableFilterOption {
  value: string;
  label: string;
}

/**
 * Definición de un filtro. El kit pinta el botón "Estado: Publicadas ⌄" —
 * `label` es "Estado" y el resto sale de la opción activa (principio 02:
 * "Los filtros muestran su estado activo").
 */
export interface DataTableFilterDefinition<T> {
  id: string;
  /** Nombre del filtro, sin dos puntos: "Estado", "Fuente", "Portada". */
  label: string;
  options: readonly DataTableFilterOption[];
  /** Valor que significa "sin filtrar". Por defecto, el de la primera opción. */
  defaultValue?: string;
  /** Solo se llama cuando el valor NO es el de por defecto. */
  match: (row: T, value: string) => boolean;
}

/**
 * Definición de un filtro cuando quien filtra es el SERVIDOR.
 *
 * Es `DataTableFilterDefinition` sin `match`: con la lista paginada, el
 * navegador solo tiene 15 filas y un predicado local filtraría la página
 * visible, no el catálogo. El `value` de cada opción es literalmente el que
 * viaja en la URL (`status=VISIBLE`), y el valor por defecto es el que significa
 * "sin filtrar" — normalmente `""`, que el cliente omite de la petición.
 */
export interface DataTableServerFilterDefinition {
  id: string;
  label: string;
  options: readonly DataTableFilterOption[];
  defaultValue?: string;
}

/** Lo que el kit entrega ya resuelto a la barra de herramientas. */
export interface DataTableFilterState {
  id: string;
  label: string;
  options: readonly DataTableFilterOption[];
  value: string;
  /** Etiqueta de la opción activa: lo que se pinta tras los dos puntos. */
  activeOptionLabel: string;
  /** `true` mientras el filtro está en su valor "sin filtrar". */
  isDefault: boolean;
  onChange: (value: string) => void;
}

export interface DataTableBulkAction {
  id: string;
  label: string;
  /** Recibe los ids seleccionados en el momento del clic. */
  onSelect: (selectedIds: readonly string[]) => void;
  /** `danger` diferencia la acción destructiva dentro de la barra. */
  tone?: "default" | "danger";
  disabled?: boolean;
}

export interface DataTableRowAction {
  id: string;
  label: string;
  onSelect: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
}

/** Un ítem de la paginación: un número o el hueco entre bloques. */
export type DataTablePageItem =
  | { kind: "page"; page: number }
  | { kind: "ellipsis"; key: string };

export interface DataTablePaginationState {
  /** Página actual, base 1 y ya acotada al total de páginas. */
  page: number;
  pageCount: number;
  pageSize: number;
  /** Total de filas DESPUÉS de buscar y filtrar. */
  totalRows: number;
  /** Primer registro visible, base 1. Vale 0 cuando no hay filas. */
  rangeStart: number;
  rangeEnd: number;
  items: readonly DataTablePageItem[];
  goTo: (page: number) => void;
  previous: () => void;
  next: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

/** Estado de la casilla del encabezado, referido a la PÁGINA visible. */
export type DataTableHeaderCheckState = "none" | "some" | "all";

export interface DataTableSelectionState {
  selectedIds: readonly string[];
  selectedCount: number;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  /** `some` es el estado indeterminado de la casilla del encabezado. */
  headerState: DataTableHeaderCheckState;
  /** Marca o desmarca las filas de la página actual. */
  togglePage: () => void;
  /**
   * Marca TODAS las filas que pasan el filtro, no solo las de la página.
   *
   * OPCIONAL: solo existe cuando el navegador tiene todas las filas filtradas
   * (modo cliente). Con paginación en servidor no las tiene, así que la oferta
   * "seleccionar los N de todas las páginas" no se puede sostener y este campo
   * viene `undefined` — la barra de acciones masivas entonces ni la ofrece. Ver
   * `useServerDataTable`.
   */
  selectAllFiltered?: () => void;
  clear: () => void;
  /**
   * Cuántas filas hay seleccionables en total (las filtradas). `undefined`
   * cuando ese total no es alcanzable desde el navegador.
   */
  selectableCount?: number;
  /** Cuántas de esas filas quedan fuera de la página actual. */
  isPageFullySelected: boolean;
}

export type DataTableEmptyReason = "none" | "no-rows" | "no-matches";

/** Copy del vacío "todavía no hay nada". */
export interface DataTableEmptyCopy {
  title: string;
  /** "Explica qué falta y ofrece una acción útil." */
  description: string;
  action?: { label: string; onSelect: () => void };
  /** Ícono dentro del círculo de 72px. Decorativo. */
  icon?: React.ReactNode;
}

/** Copy del vacío "ningún resultado para este filtro". La acción la pone el kit. */
export interface DataTableNoResultsCopy {
  title?: string;
  description?: string;
  clearLabel?: string;
}

export interface DataTableController<T> {
  /**
   * Filas tal como llegaron, sin buscar ni filtrar. Solo en modo cliente: con
   * paginación en servidor el navegador nunca las tiene todas.
   */
  allRows?: readonly T[];
  /** Filas que pasan búsqueda y filtros. Solo en modo cliente, por lo mismo. */
  filteredRows?: readonly T[];
  /** Filas de la página actual: lo que se pinta. */
  pageRows: readonly T[];
  getRowId: (row: T) => string;
  search: {
    value: string;
    onChange: (value: string) => void;
    /** `false` cuando la pantalla no declaró `searchIn`. */
    enabled: boolean;
  };
  filters: readonly DataTableFilterState[];
  /** Hay texto de búsqueda o algún filtro fuera de su valor por defecto. */
  hasActiveQuery: boolean;
  /** Devuelve búsqueda y filtros a su estado inicial y vuelve a la página 1. */
  clearFilters: () => void;
  pagination: DataTablePaginationState;
  /** `null` cuando la tabla se declaró sin selección. */
  selection: DataTableSelectionState | null;
  emptyReason: DataTableEmptyReason;
}
