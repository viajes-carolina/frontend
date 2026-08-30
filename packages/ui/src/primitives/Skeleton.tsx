import React from "react";

export interface SkeletonProps {
  className?: string;
}

/**
 * Átomo de carga — una barra `animate-pulse` en el tono neutro de la marca
 * (`bg-neutral-border`, no un gris genérico de Tailwind). El tamaño/forma se
 * define enteramente por `className` (alto, ancho, radio) desde quien lo usa.
 * Puramente decorativa — `aria-hidden` porque el anuncio a lectores de
 * pantalla vive una sola vez en el contenedor (`FormSkeleton`/`TableSkeleton`/
 * `CardsGridSkeleton`/`TableSkeletonRows`), no repetido por cada barra.
 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-neutral-border ${className}`} />;
}

/** Anuncio único para lectores de pantalla, reutilizado por los 3 contenedores. */
function LoadingAnnouncement() {
  return (
    <span className="sr-only" role="status" aria-live="polite">
      Cargando…
    </span>
  );
}

export interface FormSkeletonProps {
  /** Cantidad de pares label+input a simular. */
  fields?: number;
  className?: string;
}

/**
 * Skeleton para las páginas de un solo registro (título, campos, un bloque más
 * alto tipo textarea, botón de guardar) — replica el contenedor de `FormCard`
 * (`rounded-[12px]`, borde `neutral-border`, sombra suave, `p-6 sm:p-8`) para
 * que no haya salto de layout entre el esqueleto y el formulario real.
 */
export function FormSkeleton({ fields = 4, className = "" }: FormSkeletonProps) {
  return (
    // `LoadingAnnouncement` va FUERA del div `space-y-6`: aunque es invisible
    // (`sr-only`), el selector de hermanos de Tailwind (`> * + *`) no distingue
    // `position: absolute` — contarla como hermano habría corrido un
    // `margin-top` extra hacia el primer bloque real.
    <>
      <LoadingAnnouncement />
      <div
        className={`space-y-6 rounded-[12px] border border-neutral-border bg-white p-6 shadow-[0_8px_24px_rgba(17,34,48,0.06)] sm:p-8 ${className}`}
      >
        <div className="space-y-3 border-b border-admin-divider pb-5">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end border-t border-admin-divider pt-6">
          <Skeleton className="h-11 w-40" />
        </div>
      </div>
    </>
  );
}

export interface TableSkeletonProps {
  rows?: number;
  className?: string;
}

/**
 * Skeleton standalone para páginas de tabla/lista — mismo contenedor
 * (`rounded-2xl border border-neutral-border bg-white shadow-sm
 * overflow-hidden`) que las tablas reales del panel.
 */
export function TableSkeleton({ rows = 6, className = "" }: TableSkeletonProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm ${className}`}>
      <LoadingAnnouncement />
      <div className="border-b border-neutral-border p-4">
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="divide-y divide-neutral-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20 shrink-0" />
            <Skeleton className="h-4 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TableSkeletonRowsProps {
  rows?: number;
  /** Debe coincidir con la cantidad de columnas de la tabla real (`colSpan`). */
  columns: number;
}

/**
 * Variante de `TableSkeleton` para insertar DENTRO de un `<table><tbody>` ya
 * existente (devuelve `<tr>`, no un contenedor propio) — para los
 * componentes compartidos que ya arman su propia tabla y solo necesitan
 * filas placeholder mientras `loading` está activo.
 */
export function TableSkeletonRows({ rows = 5, columns }: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td colSpan={columns} className="p-4">
            {/* El anuncio va dentro de la primera celda (no en el <tr>, que
                rompería la semántica de fila para lectores de pantalla que
                navegan la tabla) — una sola vez, no repetido por fila. */}
            {i === 0 && <LoadingAnnouncement />}
            <Skeleton className="h-4 w-full" />
          </td>
        </tr>
      ))}
    </>
  );
}

export interface CardsGridSkeletonProps {
  cards?: number;
  className?: string;
}

/** Skeleton para grillas de tarjetas — hoy solo lo usa el dashboard del panel. */
export function CardsGridSkeleton({ cards = 9, className = "" }: CardsGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      <LoadingAnnouncement />
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-neutral-border bg-white p-6 shadow-sm">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
