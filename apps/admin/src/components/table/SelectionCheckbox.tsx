"use client";

import React from "react";
import { Checkbox } from "@vc/ui";

/**
 * La casilla de selección de una tabla, con el tercer estado que el encabezado
 * necesita.
 *
 * ── Indeterminado ────────────────────────────────────────────────────────
 * `indeterminate` NO es un atributo de HTML: solo existe como propiedad del
 * elemento, así que se escribe sobre el nodo desde un efecto. Es lo que hace
 * que el navegador anuncie la casilla como "mixta" en el árbol de
 * accesibilidad.
 *
 * No se añade `aria-checked="mixed"`: en un `<input type="checkbox">` nativo
 * ARIA prohíbe sobrescribir el estado, que ya viene implícito de la propiedad.
 * Ponerlo daría dos fuentes de verdad y algunos lectores leerían la que no
 * toca.
 *
 * ── La rayita ────────────────────────────────────────────────────────────
 * "Selección, visibilidad y estado sin depender únicamente del color": marcado
 * y mixto no pueden diferenciarse solo porque los dos se pinten de azul. El
 * `Checkbox` de `@vc/ui` trae su palomita para el estado marcado, pero no una
 * rayita para el mixto, y este kit no toca `packages/ui`. Se superpone aquí,
 * absolutamente posicionada sobre el cuadro de 18px y sin recibir eventos, de
 * modo que el control sigue siendo el input real de debajo.
 *
 * ── Por qué `onChange` no recibe el evento ───────────────────────────────
 * Marcar o desmarcar lo decide el controlador (`useDataTable`), que ya sabe si
 * la página está entera o a medias. La casilla solo avisa de que la pulsaron.
 */
export interface SelectionCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  /** Nombre accesible. Obligatorio: nunca hay etiqueta visible al lado. */
  label: string;
  disabled?: boolean;
}

export function SelectionCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled,
}: SelectionCheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <span className="relative inline-flex">
      <Checkbox
        ref={inputRef}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
        /* El relleno azul del estado mixto: la variante `checked:` del
           primitivo no aplica porque `checked` es `false` mientras hay mezcla. */
        className="indeterminate:border-info indeterminate:bg-info"
      />
      {indeterminate && !checked && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[4px] top-[8px] h-[2px] w-[10px] rounded-full bg-white"
        />
      )}
    </span>
  );
}
