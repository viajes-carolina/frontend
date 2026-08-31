"use client";

import React from "react";
import { Button } from "./Button";
import { useDialogFocusTrap } from "./useDialogFocusTrap";

/**
 * Confirmación de una acción destructiva (guía de estilo del panel, `970:7`).
 * Sustituye al `window.confirm()` nativo, que ni respeta la marca ni permite
 * nombrar el elemento afectado con jerarquía.
 *
 * ── Regla literal de la guía ─────────────────────────────────────────────
 * "La consecuencia y el objeto afectado deben aparecer explícitamente."
 * Por eso `title` y `description` son obligatorios y separados: el título
 * NOMBRA el elemento («¿Eliminar "Madrid te espera"?») y la descripción dice
 * qué ocurre y que no se puede deshacer. Un solo texto mezclando ambas cosas
 * es justo lo que hacía el `confirm()` nativo.
 *
 * ── Anatomía ─────────────────────────────────────────────────────────────
 * Tarjeta sobre `danger-surface` con borde `danger-border`, radio 8px,
 * padding 18px y gap 12px. Título 14px bold `danger-ink`, cuerpo 10px
 * `admin-value`, acciones alineadas a la derecha con gap 8px.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * - `role="alertdialog"` (no `dialog`): interrumpe y exige respuesta.
 * - `aria-labelledby` / `aria-describedby` apuntan al título y al cuerpo, que
 *   son exactamente la consecuencia y el objeto que la regla exige anunciar.
 * - El foco inicial va a "Cancelar", nunca a la acción destructiva: un Enter
 *   por inercia no debe borrar nada. Se fuerza con `initialFocusRef` en vez de
 *   confiar en que "Cancelar" siga siendo el primer botón del DOM.
 * - Trampa de foco, `Escape` y devolución del foco al disparador vienen de
 *   `useDialogFocusTrap`, el mismo comportamiento que usa `Modal`.
 * - El clic en el fondo NO cierra: descartar por accidente una pregunta de
 *   "¿seguro?" es aceptable, pero aquí el gesto ambiguo sería el único camino
 *   de salida sin decisión. Salir se hace con Escape o con "Cancelar".
 */
export interface ConfirmDialogProps {
  open: boolean;
  /** Nombra el elemento afectado: «¿Eliminar "Madrid te espera"?». */
  title: string;
  /** Qué ocurre y que no se puede deshacer. */
  description: string;
  /** Acción destructiva. Por defecto "Sí, eliminar". */
  confirmLabel?: string;
  /** Etiqueta mientras la acción está en curso. Por defecto "Eliminando…". */
  busyLabel?: string;
  cancelLabel?: string;
  /** `true` bloquea ambos botones mientras la acción se ejecuta. */
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  // El panel monta y desmonta con la apertura: la trampa de foco guarda el
  // elemento previo al montar y se lo devuelve al desmontar. Por eso el early
  // return vive aquí fuera, antes de cualquier hook.
  if (!props.open) return null;
  return <ConfirmDialogPanel {...props} />;
}

function ConfirmDialogPanel({
  title,
  description,
  confirmLabel = "Sí, eliminar",
  busyLabel = "Eliminando…",
  cancelLabel = "Cancelar",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = useDialogFocusTrap<HTMLDivElement>({
    onClose: onCancel,
    initialFocusRef: cancelRef,
  });
  const titleId = React.useId();
  const descriptionId = `${titleId}-description`;

  return (
    <div
      data-vc-overlay=""
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-navy/70 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="flex w-full max-w-[440px] flex-col gap-3 rounded-[8px] border border-danger-border bg-danger-surface p-[18px] font-inter shadow-[0_16px_48px_rgba(17,34,48,0.22)]"
      >
        <h2 id={titleId} className="font-inter text-[14px] font-bold leading-tight text-danger-ink">
          {title}
        </h2>

        <p id={descriptionId} className="font-inter text-[10px] leading-[1.6] text-admin-value">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            ref={cancelRef}
            type="button"
            variant="secondary"
            size="xs"
            disabled={busy}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button type="button" variant="dangerSolid" size="xs" disabled={busy} onClick={onConfirm}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
