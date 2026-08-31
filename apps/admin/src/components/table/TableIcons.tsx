import React from "react";

/**
 * Los dos íconos que el kit necesita y `@vc/ui` no exporta.
 *
 * Viven aquí, no en `packages/ui`, porque solo los usa la tabla del panel: la
 * lupa del campo de búsqueda de la barra de herramientas ("icono ⌕ 18px") y el
 * relleno del círculo de 72px del estado vacío. Ambos son decorativos —
 * `aria-hidden`— y el texto que llevan al lado es el que comunica.
 *
 * `currentColor` en vez de un color propio: el tono lo pone la clase del
 * contenedor y así el ícono acompaña al estado (foco, deshabilitado) sin
 * variantes.
 */
export interface TableIconProps {
  size?: number;
  className?: string;
}

export function TableSearchIcon({ size = 18, className = "" }: TableIconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13.2 13.2 17 17" />
    </svg>
  );
}

/** Relleno por defecto del círculo del estado vacío: una bandeja sin contenido. */
export function TableEmptyIcon({ size = 28, className = "" }: TableIconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 13h4l1.5 3h7L17 13h4" />
      <path d="M4.5 13 6 5.5h12L19.5 13V18a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" />
    </svg>
  );
}
