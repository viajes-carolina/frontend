"use client";

import React from "react";
import { ChevronDownIcon } from "../icons/icons";

export interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  /**
   * `"inline"` mantiene el acordeón discreto dentro de una tarjeta (una
   * divisoria arriba y el texto en versalitas) — es el uso histórico para
   * "campos heredados" y "opciones adicionales".
   *
   * `"panel"` es la fila de 44px de la guía del panel (Figma 970:7): caja
   * propia con borde, etiqueta a la izquierda e icono a la derecha. Se usa
   * cuando el acordeón ES la sección, no un apéndice de otra.
   */
  variant?: "inline" | "panel";
}

/**
 * Acordeón `<details>/<summary>` del panel.
 *
 * El icono va a la DERECHA en la variante `panel` porque así lo define la guía;
 * antes el componente lo pintaba siempre a la izquierda y quien necesitaba la
 * forma del diseño tenía que corregirlo desde fuera con variantes arbitrarias
 * sobre el `<summary>`. Ese arreglo vive ahora aquí, que es su sitio.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = "",
  variant = "inline",
}: DisclosureProps) {
  const isPanel = variant === "panel";

  return (
    <details
      open={defaultOpen}
      className={`group ${
        isPanel
          ? "overflow-hidden rounded-[8px] border border-neutral-border bg-white"
          : "border-t border-neutral-border pt-4"
      } ${className}`}
    >
      <summary
        className={`flex cursor-pointer select-none list-none items-center justify-between gap-2 font-inter ${
          isPanel
            ? "h-[44px] px-[14px] text-[12px] font-semibold text-neutral-ink"
            : "text-xs font-semibold uppercase tracking-wider text-neutral-muted"
        }`}
      >
        {/* En `inline` el icono precede al texto (orden histórico); en `panel`
            el `order` lo manda al extremo derecho sin duplicar el markup. */}
        <ChevronDownIcon
          size={isPanel ? 18 : 14}
          aria-hidden="true"
          className={`shrink-0 transition-transform group-open:rotate-180 ${
            isPanel ? "order-2 text-neutral-muted" : ""
          }`}
        />
        <span className={isPanel ? "order-1" : ""}>{summary}</span>
      </summary>

      <div className={isPanel ? "border-t border-neutral-border px-[14px] py-4" : "mt-3"}>{children}</div>
    </details>
  );
}
