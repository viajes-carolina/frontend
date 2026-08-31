"use client";

import React from "react";
import { createPortal } from "react-dom";
import { FOCUS_RING_CLASSES, MENU_ITEM_CLASSES, MENU_PANEL_CLASSES } from "./tableStyles";
import { useAnchoredMenu } from "./useAnchoredMenu";
import type { DataTableRowAction } from "./types";

/**
 * El menú "•••" de una fila.
 *
 * ── Anatomía (guía) ──────────────────────────────────────────────────────
 * "Acciones: '•••' 14px bold #5b6b79". Los tres puntos son texto, no un ícono:
 * es lo que dice el diseño y evita inventar un glifo.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * `aria-label` obligatorio y con el nombre de la fila dentro ("Acciones de
 * «Madrid te espera»"): en una tabla de quince filas, quince botones llamados
 * "Acciones" no permiten distinguir cuál es cuál. Los puntos van
 * `aria-hidden` — "•••" leído en voz alta no es un nombre.
 *
 * El panel sale a un portal para no quedar recortado por el desbordamiento
 * horizontal de la tabla; el porqué está en `useAnchoredMenu`.
 */
export interface TableRowActionsProps {
  actions: readonly DataTableRowAction[];
  /** Nombre accesible del disparador. Debe identificar la fila. */
  label: string;
}

const TONE_CLASSES = {
  default: "text-admin-value",
  danger: "text-danger-ink hover:bg-danger-surface",
} as const;

export function TableRowActions({ actions, label }: TableRowActionsProps) {
  const menu = useAnchoredMenu(actions.length);

  if (actions.length === 0) {
    return null;
  }

  const panel = (
    <div
      ref={menu.panelRef}
      id={menu.menuId}
      role="menu"
      aria-labelledby={menu.triggerId}
      onKeyDown={menu.handleMenuKeyDown}
      style={menu.style ?? undefined}
      className={MENU_PANEL_CLASSES}
    >
      {actions.map((action, index) => (
        <button
          key={action.id}
          ref={menu.setItemRef(index)}
          type="button"
          role="menuitem"
          disabled={action.disabled}
          onClick={() => {
            action.onSelect();
            menu.close(true);
          }}
          className={`${MENU_ITEM_CLASSES} ${TONE_CLASSES[action.tone ?? "default"]}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={menu.containerRef} className="inline-flex">
      <button
        ref={menu.triggerRef}
        id={menu.triggerId}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menu.menuId : undefined}
        onClick={menu.handleTriggerClick}
        onKeyDown={menu.handleTriggerKeyDown}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] font-inter text-[14px] font-bold leading-none text-neutral-quiet-ink transition-colors hover:bg-neutral-quiet-surface ${FOCUS_RING_CLASSES}`}
      >
        <span aria-hidden="true">•••</span>
      </button>

      {menu.open && menu.portalTarget && createPortal(panel, menu.portalTarget)}
    </div>
  );
}
