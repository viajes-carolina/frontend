"use client";

import React from "react";
import { CheckIcon, ChevronDownIcon } from "@vc/ui";
import { FILTER_TRIGGER_CLASSES, MENU_ITEM_CLASSES, MENU_PANEL_CLASSES } from "./tableStyles";
import { usePopoverMenu } from "./usePopoverMenu";
import type { DataTableFilterState } from "./types";

/**
 * Un filtro de la barra de herramientas: "Estado: Publicadas ⌄".
 *
 * ── Principio 02 de la guía: "Los filtros muestran su estado activo" ─────
 * El valor elegido se lee en la propia etiqueta del botón, sin abrir nada. Si
 * la opción activa tiene la etiqueta vacía, se pinta solo el nombre del filtro
 * ("Portada ⌄"), que es como el diseño representa el filtro sin valor puesto.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * Patrón `menu` de WAI-ARIA: el disparador declara `aria-haspopup="menu"` y su
 * `aria-expanded`; los ítems son `menuitemradio` con `aria-checked`, de modo
 * que un lector anuncia cuál está elegida. El teclado (flechas, Inicio/Fin,
 * Escape, Tab) lo pone `usePopoverMenu`.
 *
 * La opción activa lleva palomita además del color — el estado no se comunica
 * solo con tono.
 */
export interface TableFilterMenuProps {
  filter: DataTableFilterState;
}

export function TableFilterMenu({ filter }: TableFilterMenuProps) {
  const menu = usePopoverMenu(filter.options.length);

  return (
    <div ref={menu.containerRef} className="relative">
      <button
        ref={menu.triggerRef}
        id={menu.triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-controls={menu.open ? menu.menuId : undefined}
        onClick={menu.toggle}
        onKeyDown={menu.handleTriggerKeyDown}
        className={FILTER_TRIGGER_CLASSES}
      >
        <span>
          {filter.label}
          {filter.activeOptionLabel ? `: ${filter.activeOptionLabel}` : ""}
        </span>
        <ChevronDownIcon
          size={12}
          aria-hidden="true"
          className={`shrink-0 text-neutral-quiet-ink transition-transform duration-150 ${
            menu.open ? "rotate-180" : ""
          }`}
        />
      </button>

      {menu.open && (
        <div
          ref={menu.panelRef}
          id={menu.menuId}
          role="menu"
          aria-labelledby={menu.triggerId}
          onKeyDown={menu.handleMenuKeyDown}
          className={`absolute left-0 top-[calc(100%+6px)] ${MENU_PANEL_CLASSES}`}
        >
          {filter.options.map((option, index) => {
            const active = option.value === filter.value;
            return (
              <button
                key={option.value}
                ref={menu.setItemRef(index)}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  filter.onChange(option.value);
                  menu.close(true);
                }}
                className={`${MENU_ITEM_CLASSES} ${
                  active ? "font-semibold text-info" : "text-admin-value"
                }`}
              >
                <span className="flex w-3 shrink-0 justify-center">
                  {active && <CheckIcon size={12} aria-hidden="true" />}
                </span>
                {option.label || `Sin filtrar por ${filter.label.toLowerCase()}`}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
