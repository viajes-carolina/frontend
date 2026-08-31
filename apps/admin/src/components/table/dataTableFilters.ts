import type { DataTableFilterDefinition } from "./types";

/**
 * Utilidades puras de búsqueda y filtrado del kit de tabla. Sin React: se
 * pueden probar sueltas y el hook solo las orquesta.
 */

/**
 * Normaliza para comparar: minúsculas y sin tildes.
 *
 * Sin quitar los diacríticos, buscar "bogota" no encontraría "Bogotá" y
 * "peru" no encontraría "Perú" — que es exactamente lo que una persona teclea
 * cuando va con prisa. `NFD` separa la letra de su tilde y `\p{Diacritic}`
 * borra las tildes ya sueltas. La ñ también se descompone, así que "cusquena"
 * encuentra "Cusqueña".
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Valor "sin filtrar" de cada filtro: el declarado o el de la primera opción. */
export function resolveDefaultFilterValues<T>(
  filters: readonly DataTableFilterDefinition<T>[]
): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const filter of filters) {
    defaults[filter.id] = filter.defaultValue ?? filter.options[0]?.value ?? "";
  }
  return defaults;
}

/**
 * Aplica filtros y búsqueda en ese orden.
 *
 * Un filtro en su valor por defecto no llega nunca a `match`: "Todos" no es una
 * condición que la pantalla tenga que saber responder, es la ausencia de
 * condición. Eso deja los `match` de las pantallas reducidos al caso real.
 */
export function selectVisibleRows<T>(
  rows: readonly T[],
  filters: readonly DataTableFilterDefinition<T>[],
  filterValues: Record<string, string>,
  defaults: Record<string, string>,
  query: string,
  searchIn?: (row: T) => ReadonlyArray<string | null | undefined>
): T[] {
  const activeFilters = filters.filter(
    (filter) => (filterValues[filter.id] ?? defaults[filter.id]) !== defaults[filter.id]
  );

  const needle = normalizeSearchText(query);

  return rows.filter((row) => {
    for (const filter of activeFilters) {
      if (!filter.match(row, filterValues[filter.id] ?? defaults[filter.id])) {
        return false;
      }
    }

    if (!needle || !searchIn) {
      return true;
    }

    return searchIn(row).some(
      (field) => typeof field === "string" && normalizeSearchText(field).includes(needle)
    );
  });
}

/** `true` si hay texto buscado o algún filtro fuera de su valor por defecto. */
export function hasActiveQuery(
  query: string,
  filterValues: Record<string, string>,
  defaults: Record<string, string>
): boolean {
  if (query.trim().length > 0) {
    return true;
  }
  return Object.keys(defaults).some((id) => (filterValues[id] ?? defaults[id]) !== defaults[id]);
}
