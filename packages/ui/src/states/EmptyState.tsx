"use client";

import React from "react";
import { Button } from "../primitives/Button";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  /** Ícono a la izquierda de la etiqueta ("+ Nueva promoción"). */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface EmptyStateProps {
  /** Qué falta: "Aún no hay promociones". */
  title: string;
  /** Qué hacer al respecto: "Crea la primera promoción para comenzar…". */
  message: string;
  /** Contenido de la ilustración circular de 72px. Decorativo. */
  icon?: React.ReactNode;
  /**
   * Acción útil. Es opcional a propósito: hay vacíos sin salida desde la propia
   * pantalla (un listado filtrado, un rol sin permiso de creación), y ahí un
   * botón sería una promesa falsa.
   */
  action?: EmptyStateAction;
  className?: string;
}

/**
 * Estado vacío de una colección (guía de estilo del panel, `970:9`).
 *
 * ── Regla literal de la guía ─────────────────────────────────────────────
 * "Explica qué falta y ofrece una acción útil."
 * De ahí los tres huecos: `title` dice qué falta, `message` dice cómo llenarlo
 * y `action` lo hace posible sin salir de la pantalla. Un "No hay resultados"
 * a secas no cumple ninguna de las dos mitades.
 *
 * ── Anatomía ─────────────────────────────────────────────────────────────
 * Bloque centrado con gap de 14px: ilustración circular de 72px, título,
 * mensaje de 12px `neutral-quiet-ink` centrado y un botón primario.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * El círculo es decorativo (`aria-hidden`): lo que falta lo dice el texto, no
 * el dibujo. No lleva `role="status"` porque no es un cambio que anunciar,
 * sino el contenido de la región — se lee con la navegación normal.
 */
export function EmptyState({ title, message, icon, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-[14px] px-6 py-12 text-center font-inter ${className}`}
    >
      <span
        aria-hidden="true"
        className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-neutral-quiet-surface text-neutral-quiet-ink"
      >
        {icon}
      </span>

      <div className="flex flex-col gap-1.5">
        <p className="font-inter text-[14px] font-bold leading-tight text-neutral-ink">{title}</p>
        <p className="max-w-[38ch] font-inter text-[12px] leading-[1.6] text-neutral-quiet-ink">
          {message}
        </p>
      </div>

      {action && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={action.icon}
          iconPosition="left"
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
