import type { DataTablePageItem } from "./types";

/**
 * Construye la lista de botones numerados de la paginación, con huecos cuando
 * hay demasiadas páginas para pintarlas todas.
 *
 *   12 páginas, actual 6, siblings 1  →  1 … 5 6 7 … 12
 *   7 páginas, actual 1               →  1 2 3 4 5 6 7   (cabe entera)
 *
 * Función pura y sin React: la paginación es aritmética, no estado.
 *
 * El umbral (`maxSlots`) es el número de casillas a partir del cual poner un
 * hueco AHORRA espacio. Con 1 hermano a cada lado hacen falta 7 casillas
 * (primera + hueco + 3 centrales + hueco + última); con menos páginas que eso,
 * pintar el rango completo ocupa lo mismo o menos y evita huecos que no
 * esconden nada.
 */
export function buildPageItems(
  currentPage: number,
  pageCount: number,
  siblingCount = 1
): DataTablePageItem[] {
  if (pageCount <= 1) {
    return [{ kind: "page", page: 1 }];
  }

  const maxSlots = siblingCount * 2 + 5;
  if (pageCount <= maxSlots) {
    return range(1, pageCount).map((page) => ({ kind: "page", page }));
  }

  /* El bloque central se ancla al centro cuando puede, y se pega a un extremo
     cuando la página actual está cerca de él — así el número de casillas es
     siempre el mismo y los botones no bailan de sitio al paginar. */
  const first = 1;
  const last = pageCount;
  const start = Math.max(first + 1, Math.min(currentPage - siblingCount, last - siblingCount * 2 - 2));
  const end = Math.min(last - 1, Math.max(currentPage + siblingCount, first + siblingCount * 2 + 2));

  const items: DataTablePageItem[] = [{ kind: "page", page: first }];

  if (start > first + 1) {
    items.push({ kind: "ellipsis", key: "start" });
  }

  for (const page of range(start, end)) {
    items.push({ kind: "page", page });
  }

  if (end < last - 1) {
    items.push({ kind: "ellipsis", key: "end" });
  }

  items.push({ kind: "page", page: last });
  return items;
}

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let value = from; value <= to; value += 1) {
    out.push(value);
  }
  return out;
}
