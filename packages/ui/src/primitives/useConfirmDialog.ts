"use client";

import React from "react";
import type { ConfirmDialogProps } from "./ConfirmDialog";

/** Lo que hay que decir para pedir una confirmación destructiva. */
export interface ConfirmDialogRequest {
  /** Nombra el elemento afectado: «¿Eliminar "Madrid te espera"?». */
  title: string;
  /** Qué ocurre y que no se puede deshacer. */
  description: string;
  confirmLabel?: string;
  busyLabel?: string;
  cancelLabel?: string;
  /** Se ejecuta al confirmar. Si devuelve una promesa, el diálogo espera. */
  onConfirm: () => void | Promise<void>;
}

export interface UseConfirmDialogResult {
  /** Abre la confirmación. Sustituye a la llamada a `window.confirm()`. */
  ask: (request: ConfirmDialogRequest) => void;
  /** Props listas para `<ConfirmDialog {...dialogProps} />`. */
  dialogProps: ConfirmDialogProps;
}

/**
 * Estado de la confirmación destructiva, fuera del `.tsx`.
 *
 * `window.confirm()` era síncrono y bloqueante, así que el hook que borraba
 * podía preguntar en medio de su propio flujo. Un diálogo React no puede: hay
 * que guardar qué se iba a hacer y ejecutarlo cuando llegue la respuesta. Eso
 * es todo lo que guarda este hook — la petición pendiente y si su acción está
 * en curso.
 *
 * El `busy` lo lleva el propio hook y no el caller: entre el clic en
 * "Sí, eliminar" y el fin de la petición, el diálogo sigue en pantalla y sus
 * dos botones deben quedar bloqueados. Sin eso, un doble clic dispara dos
 * borrados.
 */
export function useConfirmDialog(): UseConfirmDialogResult {
  const [request, setRequest] = React.useState<ConfirmDialogRequest | null>(null);
  const [busy, setBusy] = React.useState(false);

  const ask = React.useCallback((next: ConfirmDialogRequest) => {
    setBusy(false);
    setRequest(next);
  }, []);

  const cancel = React.useCallback(() => {
    setRequest(null);
    setBusy(false);
  }, []);

  const confirm = React.useCallback(async () => {
    if (!request) return;
    setBusy(true);
    try {
      await request.onConfirm();
    } finally {
      // El diálogo se cierra pase lo que pase: el resultado — incluido el
      // fallo — lo cuenta el banner de la pantalla, no la confirmación.
      setBusy(false);
      setRequest(null);
    }
  }, [request]);

  const dialogProps = React.useMemo<ConfirmDialogProps>(
    () => ({
      open: request !== null,
      title: request?.title ?? "",
      description: request?.description ?? "",
      confirmLabel: request?.confirmLabel,
      busyLabel: request?.busyLabel,
      cancelLabel: request?.cancelLabel,
      busy,
      onConfirm: confirm,
      onCancel: cancel,
    }),
    [request, busy, confirm, cancel]
  );

  return { ask, dialogProps };
}
