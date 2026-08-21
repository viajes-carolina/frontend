"use client";

import React from "react";

export interface JourneyConnectorProps {
  /** Número de etapa, ej. "01" — mismo lenguaje visual en las 3 apariciones de la ruta. */
  step: string;
  /** Ej. "Imaginar → Explorar" — describe la transición narrativa, no la sección en sí. */
  label: string;
}

/**
 * Aparece solo en las 3 transiciones narrativas clave de Inicio (no entre cada bloque):
 * Hero→Descubrir, Explorar→Prepararte, Prepararte→Conversar. Comparte el mismo hilo
 * naranja y marcador numerado en las tres para sentirse una sola ruta, no decoraciones
 * independientes.
 */
export function JourneyConnector({ step, label }: JourneyConnectorProps) {
  return (
    <div
      className="w-full flex items-center justify-center gap-3 sm:gap-4 py-10 sm:py-12 select-none"
      aria-hidden="true"
    >
      <span className="h-px flex-1 max-w-[80px] sm:max-w-[140px] bg-gradient-to-r from-transparent to-brand-accent/40" />
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-full border border-brand-accent/40 bg-white text-brand-accent font-sora font-bold text-xs shadow-sm">
          {step}
        </span>
        <span className="hidden sm:inline font-sora text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-muted whitespace-nowrap">
          {label}
        </span>
      </div>
      <span className="h-px flex-1 max-w-[80px] sm:max-w-[140px] bg-gradient-to-l from-transparent to-brand-accent/40" />
    </div>
  );
}
