"use client";

import React from "react";

/**
 * Checkbox de selección del panel administrativo — el de marcar filas en las
 * tablas y opciones en los formularios.
 *
 * ── Anatomía (guía de estilo del panel) ──────────────────────────────────
 * 18x18px, radio 4px, borde #bfc9d1 (`checkbox-border`) sin marcar.
 * Marcado: fondo #2980ba (`info`) con la palomita en blanco.
 *
 * ── Por qué es un input real ─────────────────────────────────────────────
 * Es un `<input type="checkbox">` de verdad, no un `<div>` con `role`: así
 * llega el foco por teclado, la barra espaciadora lo alterna, los formularios
 * lo envían y los lectores de pantalla anuncian su estado sin ayuda. Lo que se
 * ve es el propio input con `appearance-none` y la palomita como hermano
 * decorativo, que aparece con `peer-checked`.
 *
 * El `<label>` envolvente asocia la etiqueta implícitamente y hace clicable
 * todo el bloque. Cuando no hay etiqueta visible (la casilla de una fila de
 * tabla, donde el nombre está en la celda de al lado) hay que pasar
 * `aria-label` — sin eso la casilla no tiene nombre accesible.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * "Todos los controles interactivos deben mostrar un borde azul claramente
 *  visible al recibir foco." El anillo va sobre el propio input, en el azul
 *  informativo, con separación para que no se confunda con el estado marcado.
 *
 * "Selección, visibilidad y estado sin depender únicamente del color": marcado
 * y sin marcar se distinguen también por la palomita, no solo por el relleno.
 *
 * ── Alcance ──────────────────────────────────────────────────────────────
 * Depende de tokens que solo existen en el `@theme` de
 * `apps/admin/src/app/globals.css` (`checkbox-border`, `info`), igual que
 * `FormField` y la familia `admin-*`. Es un componente del panel.
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Etiqueta visible a la derecha. Si se omite, hace falta `aria-label`. */
  label?: React.ReactNode;
  /** Clases del `<label>` contenedor. */
  wrapperClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", wrapperClassName = "", disabled, id, ...rest }, ref) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;

    return (
      <label
        htmlFor={fieldId}
        className={`inline-flex items-center gap-2 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${wrapperClassName}`}
      >
        <span className="relative inline-flex h-[18px] w-[18px] shrink-0">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            disabled={disabled}
            className={[
              "peer h-[18px] w-[18px] m-0 appearance-none",
              "rounded-[4px] border border-checkbox-border bg-white",
              "transition-colors",
              "checked:border-info checked:bg-info",
              /* Deshabilitado reutiliza la superficie y el texto apagados que
                 la guía ya define para botón y campo. `disabled:checked:*` se
                 declara aparte porque, sin él, `checked:bg-info` y
                 `disabled:bg-…` empatan en especificidad. */
              "disabled:cursor-not-allowed disabled:border-neutral-border disabled:bg-neutral-quiet-surface",
              "disabled:checked:border-neutral-border disabled:checked:bg-neutral-quiet-surface",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info",
              disabled ? "" : "cursor-pointer",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          />
          {/* Palomita decorativa: el estado real lo lleva el input. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block peer-disabled:text-control-disabled-ink"
          >
            <path
              d="M1.5 6.2 4.4 9l6-6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && (
          <span
            className={`font-inter text-[12px] ${
              disabled ? "text-control-disabled-ink" : "text-admin-value"
            }`}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
