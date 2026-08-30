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
 * Switch tipo iOS con el estilo oficial de admin (fondo neutral-200, thumb
 * blanco, activo en brand-accent). Reproduce exactamente el bloque
 * duplicado en los formularios de `apps/admin`.
 *
 * Si se pasa `label`, se renderiza a un costado con el estilo de texto ya
 * usado por los callers actuales. Si el texto debe cambiar según el estado
 * (ej. "⭐ Destacado" / "Normal"), omite `label` y renderiza ese texto
 * condicional junto al `Toggle` desde el caller.
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
        <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-accent"></div>
      </label>
      {/* `text-neutral-muted` y no `neutral-700`: ese último es de la paleta por
          defecto de Tailwind y no participa de la retokenización del panel.
          El resto del switch (fondo apagado `neutral-200`, borde del thumb
          `neutral-300`) se deja como está a propósito: `CookiePreferencesPanel`
          usa este mismo Toggle en el sitio público y cambiar esos dos tonos
          alteraría /cookies. */}
      {label && <span className="font-inter text-xs font-bold text-neutral-muted">{label}</span>}
    </div>
  );
};
