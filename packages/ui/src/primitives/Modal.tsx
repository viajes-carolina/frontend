"use client";

import React from "react";
import { CloseIcon } from "../icons/icons";

export interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  /** Ancho máximo del panel del modal. Por defecto "2xl". */
  maxWidth?: "2xl" | "3xl";
  closeLabel?: string;
  children: React.ReactNode;
}

const MAX_WIDTH_CLASSES: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

/**
 * Chrome visual compartido (overlay + panel + header) para los modales de
 * formulario del panel admin. No conoce nada de formularios: el `<form>`
 * con los campos y el footer de botones los provee cada caller como
 * `children`, inmediatamente después del header.
 */
export function Modal({
  title,
  description,
  onClose,
  maxWidth = "2xl",
  closeLabel = "Cerrar",
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className={`bg-white w-full ${MAX_WIDTH_CLASSES[maxWidth]} rounded-3xl shadow-2xl border border-neutral-border p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
          <div>
            <h2 className="font-sora font-bold text-xl text-brand-navy">{title}</h2>
            {description && (
              <p className="font-inter text-xs text-neutral-muted mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="p-2 rounded-xl text-neutral-muted hover:text-brand-navy hover:bg-neutral-surface transition-colors"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
