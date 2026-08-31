"use client";

import React from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  /** Nombre accesible para lectores de pantalla cuando no hay `label` visible junto al switch (ej. el nombre ya se muestra en un elemento hermano, como en el panel de preferencias de cookies). */
  "aria-label"?: string;
}

/**
 * Switch tipo iOS sobre un `<input type="checkbox">` real (el riel y el thumb
 * son puramente visuales; el foco, el teclado y el estado los maneja el input).
 *
 * ── Geometría ────────────────────────────────────────────────────────────
 * El diseño del panel lo pide en 38x22 con thumb de 18px. El sitio público lo
 * usa en /cookies con el riel de 44x24 y thumb de 20px, así que las cuatro
 * medidas salen de variables `--vc-switch-*`: el tema compartido las declara
 * con los valores de la web y `apps/admin` las redefine con los del diseño.
 *
 * `--vc-switch-travel` reemplaza al antiguo `translate-x-full`. Aquel
 * desplazaba el thumb por su propio ancho, lo que solo cae bien cuando
 * riel = 2·margen + 2·thumb (44 = 2 + 20 + 20 + 2). En 38x22 no se cumple, y
 * el thumb se salía del riel; con el recorrido explícito la holgura de 2px
 * queda igual a ambos lados en los dos productos.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * "Todos los controles interactivos deben mostrar un borde azul claramente
 *  visible al recibir foco." El anillo se dibuja con `outline` sobre el riel
 *  cuando el input recibe foco por teclado; su color sale de `--vc-focus-ring`
 *  si la app la define (el panel, en azul informativo) y si no, del acento —
 *  que es el comportamiento actual del sitio público.
 *
 * Si se pasa `label`, se renderiza a un costado. Si el texto debe cambiar según
 * el estado (ej. "⭐ Destacado" / "Normal"), omite `label` y renderiza ese
 * texto condicional junto al `Toggle` desde el caller.
 */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled, "aria-label": ariaLabel }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={!label ? ariaLabel : undefined}
          className="sr-only peer"
        />
        {/* `text-neutral-muted` (en la etiqueta) y no `neutral-700`: ese último
            es de la paleta por defecto de Tailwind y no participa de la
            retokenización del panel. El resto del switch (fondo apagado
            `neutral-200`, borde del thumb `neutral-300`) se deja como está a
            propósito: `CookiePreferencesPanel` usa este mismo Toggle en el
            sitio público y cambiar esos dos tonos alteraría /cookies. */}
        <div
          className={[
            "w-[var(--vc-switch-width)] h-[var(--vc-switch-height)]",
            "bg-neutral-200 rounded-full peer",
            "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
            "after:h-[var(--vc-switch-thumb)] after:w-[var(--vc-switch-thumb)]",
            "after:bg-white after:border after:border-neutral-300 after:rounded-full",
            "after:transition-all",
            "peer-checked:bg-brand-accent",
            "peer-checked:after:translate-x-[var(--vc-switch-travel)] peer-checked:after:border-white",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
            "peer-focus-visible:outline-[color:var(--vc-focus-ring,var(--color-brand-accent))]",
          ].join(" ")}
        />
      </label>
      {label && <span className="font-inter text-xs font-bold text-neutral-muted">{label}</span>}
    </div>
  );
};
