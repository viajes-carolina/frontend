"use client";

import React from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
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
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
      </label>
      {label && <span className="text-xs font-bold text-neutral-700">{label}</span>}
    </div>
  );
};
