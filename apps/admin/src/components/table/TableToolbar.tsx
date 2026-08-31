"use client";

import React from "react";
import { Button, PlusIcon } from "@vc/ui";
import { TableFilterMenu } from "./TableFilterMenu";
import { TableSearchIcon } from "./TableIcons";
import type { DataTableFilterState } from "./types";

/**
 * Barra de herramientas: buscar · filtrar · crear.
 *
 * ── Principio 01: "La búsqueda permanece visible" ────────────────────────
 * El campo está siempre, sin desplegar ni icono que haya que pulsar antes. No
 * se oculta cuando hay selección: la barra de acciones masivas se apila DEBAJO
 * en vez de sustituirla.
 *
 * ── Anatomía (guía) ──────────────────────────────────────────────────────
 * Barra blanca, padding 16/14, contenido justificado entre extremos.
 * Búsqueda 330x42 sobre `admin-field`, borde `neutral-border`, radio 7.
 * Botón crear: naranja de marca — es `Button variant="primary"`, la caja de la
 * sección 01 de la guía.
 *
 * ── Accesibilidad ────────────────────────────────────────────────────────
 * El campo lleva `<label>` real, oculto a la vista: un `placeholder` no es un
 * nombre accesible (desaparece al escribir y varios lectores no lo anuncian).
 * El foco engrosa el borde a 2px en el azul informativo, igual que `FormField`,
 * y compensa el padding para que el texto no salte.
 */
export interface TableToolbarProps {
  search: { value: string; onChange: (value: string) => void; enabled: boolean };
  searchPlaceholder?: string;
  /** Nombre accesible del campo. Debe decir por dónde busca. */
  searchLabel?: string;
  filters: readonly DataTableFilterState[];
  createAction?: { label: string; onSelect: () => void; disabled?: boolean };
}

const SEARCH_INPUT_CLASSES = [
  "h-[42px] w-full rounded-[7px] border border-neutral-border bg-admin-field",
  "pl-10 pr-3 font-inter text-[11px] text-admin-value",
  "placeholder:text-control-disabled-ink transition-colors",
  "hover:border-admin-checkbox",
  "focus:border-2 focus:border-info focus:outline-none focus:pl-[39px] focus:pr-[11px]",
].join(" ");

export function TableToolbar({
  search,
  searchPlaceholder = "Buscar…",
  searchLabel = "Buscar en la tabla",
  filters,
  createAction,
}: TableToolbarProps) {
  const searchId = React.useId();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3.5">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {search.enabled && (
          <div className="relative w-full max-w-[330px]">
            <label htmlFor={searchId} className="sr-only">
              {searchLabel}
            </label>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-quiet-ink">
              <TableSearchIcon size={18} />
            </span>
            <input
              id={searchId}
              type="search"
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
              placeholder={searchPlaceholder}
              className={SEARCH_INPUT_CLASSES}
            />
          </div>
        )}

        {filters.map((filter) => (
          <TableFilterMenu key={filter.id} filter={filter} />
        ))}
      </div>

      {createAction && (
        <Button
          variant="primary"
          icon={<PlusIcon size={16} />}
          iconPosition="left"
          onClick={createAction.onSelect}
          disabled={createAction.disabled}
        >
          {createAction.label}
        </Button>
      )}
    </div>
  );
}
