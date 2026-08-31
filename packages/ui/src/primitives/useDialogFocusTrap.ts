"use client";

import React from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface UseDialogFocusTrapOptions {
  /** Se invoca al pulsar `Escape`. */
  onClose: () => void;
  /**
   * Elemento que recibe el foco al abrir. Por defecto, el primer focusable del
   * panel — que es lo correcto en un formulario, pero NO en una confirmación
   * destructiva: ahí el foco inicial debe ir a "Cancelar" y no a la acción que
   * borra.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Comportamiento de teclado y foco compartido por todos los diálogos del panel:
 * trampa de foco con `Tab`/`Shift+Tab`, cierre con `Escape` y devolución del
 * foco al elemento que abrió el diálogo.
 *
 * Se extrajo tal cual del efecto que vivía dentro de `Modal` — mismo selector,
 * mismo orden de operaciones — para que `ConfirmDialog` no tuviera que
 * reimplementarlo. Sin esto, tabular dentro de un diálogo se escapa a la página
 * de atrás y no hay forma de salir con el teclado.
 *
 * Devuelve la ref que hay que colocar en el panel del diálogo.
 */
export function useDialogFocusTrap<T extends HTMLElement = HTMLDivElement>({
  onClose,
  initialFocusRef,
}: UseDialogFocusTrapOptions): React.RefObject<T | null> {
  const panelRef = React.useRef<T>(null);

  // `onClose` suele ser una lambda nueva en cada render del caller; guardarla
  // en un ref evita re-suscribir el listener (y perder el foco previo) en cada
  // pulsación de tecla del formulario.
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  // Mismo motivo: la ref de foco inicial se lee una sola vez, al montar.
  const initialFocusRefBox = React.useRef(initialFocusRef);
  initialFocusRefBox.current = initialFocusRef;

  React.useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const requested = initialFocusRefBox.current?.current ?? null;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (requested ?? firstFocusable ?? panel)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Si hay otro diálogo abierto DENTRO de este (el selector de imágenes,
        // una confirmación), Escape le pertenece a él: cerrar el exterior
        // descartaría el formulario completo.
        if (panelRef.current?.querySelector("[data-vc-overlay]")) return;
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  return panelRef;
}
