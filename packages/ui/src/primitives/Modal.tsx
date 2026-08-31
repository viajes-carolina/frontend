"use client";

import React from "react";
import { CloseIcon } from "../icons/icons";
import { useDialogFocusTrap } from "./useDialogFocusTrap";

export interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  /**
   * Ancho máximo del panel del modal. Por defecto "2xl".
   *
   * Los tamaños grandes son para formularios que se reparten en varias
   * columnas en pantallas anchas; en un formulario de una sola columna
   * estirar el panel solo alarga las líneas y se lee peor.
   */
  maxWidth?: "2xl" | "3xl" | "5xl";
  closeLabel?: string;
  children: React.ReactNode;
}

const MAX_WIDTH_CLASSES: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "5xl": "max-w-5xl",
};

/**
 * Chrome visual compartido (overlay + panel + header) para los modales de
 * formulario del panel admin. No conoce nada de formularios: el `<form>`
 * con los campos y el footer de botones los provee cada caller como
 * `children`, inmediatamente después del header.
 *
 * El diálogo atrapa el foco mientras está abierto, se cierra con `Escape` y
 * devuelve el foco al elemento que lo abrió: sin eso, tabular dentro del modal
 * se escapaba a la página de atrás y no había forma de salir con el teclado.
 * Ese comportamiento vive ahora en `useDialogFocusTrap`, compartido con
 * `ConfirmDialog`.
 */
export function Modal({
  title,
  description,
  onClose,
  maxWidth = "2xl",
  closeLabel = "Cerrar",
  children,
}: ModalProps) {
  const panelRef = useDialogFocusTrap<HTMLDivElement>({ onClose });
  const titleId = React.useId();
  const descriptionId = `${titleId}-description`;

  return (
    <div
      data-vc-overlay=""
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-navy/70 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`my-8 max-h-[90vh] w-full ${MAX_WIDTH_CLASSES[maxWidth]} overflow-y-auto rounded-[12px] border border-neutral-border bg-white p-6 font-inter shadow-[0_16px_48px_rgba(17,34,48,0.22)] sm:p-8`}
      >
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-admin-divider pb-5">
          <div>
            <h2 id={titleId} className="font-inter text-[18px] font-bold leading-tight text-neutral-ink">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1.5 font-inter text-[13px] leading-[1.55] text-neutral-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-1 -mt-1 shrink-0 rounded-[7px] p-2 text-neutral-muted transition-colors hover:bg-neutral-soft hover:text-neutral-ink"
          >
            <CloseIcon size={20} aria-hidden="true" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
