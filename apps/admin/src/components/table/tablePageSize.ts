/**
 * "15–20 filas por página como máximo" (principio 04 de la guía). El kit toma
 * el extremo bajo del rango: 15 filas caben en una pantalla de portátil sin
 * desplazar, que es lo que hace que la paginación sirva de algo.
 *
 * ── Por qué vive en su propio archivo, sin `"use client"` ─────────────────
 * Porque un Server Component lo necesita: `inicio/promociones/page.tsx` pide la
 * primera página al backend y tiene que saber de qué tamaño. Exportado desde un
 * módulo `"use client"` —como estaba, dentro de `useDataTable.ts`— Next no
 * entrega el número: entrega una referencia de cliente. Al interpolarla en la
 * URL, el `size` de la petición pasaba a ser el texto de un `throw` de Next y el
 * backend respondía 404. Un valor compartido entre servidor y cliente tiene que
 * estar en un módulo neutro.
 */
export const DEFAULT_PAGE_SIZE = 15;
