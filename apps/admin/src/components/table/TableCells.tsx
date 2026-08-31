"use client";

import React from "react";
import { Toggle } from "@vc/ui";
import { MediaThumb } from "../MediaThumb";

/* ==========================================================================
   Celdas compuestas — las cinco formas que la guía dibuja en su fila de
   ejemplo, más la celda del dato que falta.

   Cada una es una plantilla sin estado: reciben lo que tienen que pintar. Una
   pantalla las combina en su `cell` y no vuelve a escribir tamaños ni tonos.

   Para la píldora de estado NO hay componente aquí: es `Badge` de `@vc/ui` tal
   cual. La sección "Tablas y filtros" lo dibuja a 9px/26px y la sección 03 lo
   define a 10px semibold; se usa el primitivo — un par de píxeles no justifican
   pelearse con el orden de las utilidades de Tailwind para reescribir su
   tipografía desde fuera, ni mucho menos un segundo badge.
   ========================================================================== */

/** Miniatura 62x44, radio 6 (guía). Cae con elegancia si no hay imagen. */
export interface TableThumbnailProps {
  url?: string | null;
  /** Texto alternativo: describe la fila, no "imagen". */
  alt: string;
}

export function TableThumbnail({ url, alt }: TableThumbnailProps) {
  return (
    <MediaThumb
      url={url}
      alt={alt}
      sizes="62px"
      iconSize={16}
      className="h-[44px] w-[62px] shrink-0 rounded-[6px] border border-neutral-border"
    />
  );
}

/**
 * Título de la fila (11px semibold) con su línea de meta (9px).
 *
 * `meta` es opcional y no lleva relleno: si una fila no tiene qué decir ahí, no
 * se pinta una segunda línea vacía que descuadre la altura.
 */
export interface TableTitleProps {
  title: string;
  meta?: React.ReactNode;
  /** Máximo de líneas del título antes de recortar. */
  clamp?: 1 | 2;
}

export function TableTitle({ title, meta, clamp = 2 }: TableTitleProps) {
  return (
    <div className="min-w-0">
      <span
        title={title}
        className={`block font-inter text-[11px] font-semibold leading-[1.35] text-admin-heading ${
          clamp === 1 ? "line-clamp-1" : "line-clamp-2"
        }`}
      >
        {title}
      </span>
      {meta && (
        <span className="mt-0.5 block font-inter text-[9px] leading-[1.4] text-neutral-quiet-ink">
          {meta}
        </span>
      )}
    </div>
  );
}

/**
 * Texto suelto de una celda.
 *
 *   `strong`  10px sobre `brand-navy` — el dato principal ("Hoy, 09:42")
 *   `muted`   10px medium sobre `neutral-quiet-ink` — el dato de apoyo ("Manual")
 */
export interface TableTextProps {
  children: React.ReactNode;
  tone?: "strong" | "muted";
}

export function TableText({ children, tone = "strong" }: TableTextProps) {
  return (
    <span
      className={`font-inter text-[10px] leading-[1.4] ${
        tone === "muted" ? "font-medium text-neutral-quiet-ink" : "text-brand-navy"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * La celda que NO tiene dato.
 *
 * "Sin datos inventados": una celda vacía se lee como un fallo de carga y un
 * guion suelto no dice si el dato no existe, no aplica o no llegó. Así que se
 * escribe qué pasa — "Sin publicar", "No registrado" — en el tono apagado que
 * la distingue de un valor real.
 */
export interface TableEmptyCellProps {
  /** Qué falta, en concreto. Evita "—" y "N/A". */
  children?: React.ReactNode;
}

export function TableEmptyCell({ children = "Sin dato" }: TableEmptyCellProps) {
  return (
    <span className="font-inter text-[10px] italic leading-[1.4] text-control-disabled-ink">
      {children}
    </span>
  );
}

/**
 * Switch de fila (38x22 en el panel, ver `Toggle`).
 *
 * `label` es el nombre accesible e incluye la fila, porque en una tabla hay
 * tantos switches como filas. `reason` explica por qué está bloqueado cuando lo
 * está: un control apagado sin motivo es una pared.
 */
export interface TableToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  reason?: string;
}

export function TableToggle({ checked, onChange, label, disabled, reason }: TableToggleProps) {
  return (
    <span className="inline-flex" title={reason}>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} aria-label={label} />
    </span>
  );
}
