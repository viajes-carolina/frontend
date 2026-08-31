"use client";

import React from "react";
import { Button } from "../primitives/Button";

export interface RetryableErrorProps {
  /**
   * Qué pasó y qué se conservó, en una frase.
   * Ej.: "La conexión se interrumpió. Tus filtros siguen guardados."
   */
  message: string;
  onRetry: () => void;
  /** Por defecto "Intentar nuevamente". */
  retryLabel?: string;
  /** Etiqueta mientras el reintento está en curso. */
  retryingLabel?: string;
  retrying?: boolean;
  className?: string;
}

/**
 * Error recuperable con reintento (guía de estilo del panel, `970:9`).
 *
 * ── Reglas literales de la guía ──────────────────────────────────────────
 * "Describe el problema sin culpar a la persona." → el sujeto del mensaje es
 * el sistema ("la conexión se interrumpió"), nunca el usuario ("no pudiste…",
 * "escribiste mal…").
 * El mensaje además DICE QUÉ SE CONSERVÓ ("Tus filtros siguen guardados"): sin
 * esa mitad, el reintento da miedo porque no se sabe qué se perdió.
 *
 * ── Por qué no es una variante de `FormFeedback` ─────────────────────────
 * `FormFeedback` informa del RESULTADO de una acción que el usuario ya
 * completó: aparece bajo el encabezado, es efímero (los hooks lo limpian a los
 * segundos), no tiene acciones y vive en un `role="status"` + `aria-live`
 * educado que se monta siempre — incluso vacío — para que el lector de
 * pantalla lo anuncie al llegar.
 *
 * Esto es otra cosa: es el ESTADO de una región que no pudo cargar. Persiste
 * hasta resolverse, sustituye al contenido en vez de acompañarlo, lleva la
 * acción que lo desbloquea y necesita `role="alert"` porque interrumpe la
 * tarea. Meterlo dentro de `FormFeedback` obligaría a que su región live vacía
 * cargue con un botón y a subir la asertividad de todos los "Cambios
 * guardados". Son piezas complementarias, no duplicadas: pueden convivir en la
 * misma pantalla sin decir lo mismo.
 *
 * ── Anatomía ─────────────────────────────────────────────────────────────
 * Alerta sobre `danger-surface` con borde `danger-border`, radio 8px, padding
 * 16px y gap 10px: signo "!" de 22px bold, mensaje de 11px `admin-value` y
 * botón de reintento en rojo sólido.
 */
export function RetryableError({
  message,
  onRetry,
  retryLabel = "Intentar nuevamente",
  retryingLabel = "Reintentando…",
  retrying = false,
  className = "",
}: RetryableErrorProps) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center gap-2.5 rounded-[8px] border border-danger-border bg-danger-surface p-4 font-inter ${className}`}
    >
      {/* El "!" es el icono que dibuja la guía: un signo, no un glifo de
          librería. Decorativo — el problema lo cuenta el mensaje. */}
      <span
        aria-hidden="true"
        className="shrink-0 font-inter text-[22px] font-bold leading-none text-danger-ink"
      >
        !
      </span>

      <p className="min-w-[12rem] flex-1 font-inter text-[11px] leading-[1.6] text-admin-value">
        {message}
      </p>

      <Button
        type="button"
        variant="dangerSolid"
        size="xs"
        disabled={retrying}
        onClick={onRetry}
        className="shrink-0"
      >
        {retrying ? retryingLabel : retryLabel}
      </Button>
    </div>
  );
}
